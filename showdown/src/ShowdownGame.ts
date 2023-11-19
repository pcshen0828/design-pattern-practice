import { AIPlayer } from './AIPlayer';
import { Card } from './Card';
import { Deck } from './Deck';
import { ExchangeHands } from './ExchangeHands';
import { Player } from './Player';
import { promptSelect } from './helper';
import { RANK_SCORE } from './rank';
import { SUIT_SCORE } from './suit';

type ShowCardRecord = { card: Card; playerId: Player['id']; playerName: Player['name'] };

export class ShowdownGame {
  private players: Player[];
  private deck: Deck;
  private round: number;
  private exchangeHandsEvents: ExchangeHands[];

  constructor({ players }: { players: Player[] }) {
    this.players = this.validatePlayers({ players });
    this.deck = new Deck();
    this.round = 1;
    this.exchangeHandsEvents = [];
  }

  async start(): Promise<void> {
    console.log('======= Game start! =======');
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      await player.nameOneself();
    }

    this.deck.shuffle();
  }

  distributeCards(): void {
    console.log('==============');
    console.log('Players are drawing cards...');
    console.log('==============');

    const drawCount = 13;
    const playersCount = this.players.length;

    for (let i = 0; i < drawCount; i++) {
      for (let j = 0; j < playersCount; j++) {
        const player = this.players[j];
        const card = this.deck.drawCard();
        player.hand.addCard(card);
      }
    }
  }

  async takeTurns(): Promise<void> {
    while (this.round <= 13) {
      console.log(`♠️ Round ${this.round}:`);

      // update exchangeHands events
      this.exchangeHandsEvents.forEach((exchangeHandsEvent) => {
        exchangeHandsEvent.countdown();
        this.validateExchangeHandsEvent({ exchangeHandsEvent });
      });

      // players show cards
      const showCardRecords: ShowCardRecord[] = [];

      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];

        if (player.canExchangeHands) {
          const doExchangeHands = await player.exchangeHandOrNot();

          if (doExchangeHands) {
            const targetPlayerId = await this.pickExchangeHandsTargetPlayer({ requestPlayer: player });
            const targetPlayer = this.players.find((player) => player.id === targetPlayerId);

            if (targetPlayer) {
              const exchangeHandsEvent = new ExchangeHands({ requestPlayer: player, targetPlayer });
              this.exchangeHandsEvents.push(exchangeHandsEvent);
              exchangeHandsEvent.exchange();
              player.forbidExchangeHands();
            }
          }
        }

        if (player.hasCard()) {
          const card = await player.showCard();
          showCardRecords.push({ card, playerId: player.id, playerName: player.name });
        }
      }

      this.showdown({ showCardRecords });
      this.judge({ showCardRecords });
      this.round++;
      console.log('--------------');
    }
  }

  end() {
    console.log('======= Game is ending! =======');
    console.log('Calculating points...');
    let winner = this.players[0];
    this.players.forEach((player) => {
      if (player.point > winner.point) {
        winner = player;
      }
    });
    console.log('==============');
    console.log(`Winner is ${winner.name}! 🎉`);
  }

  private validatePlayers({ players }: { players: Player[] }): Player[] {
    const playersCount = players.length;
    const standardPlayersCount = 4;
    if (playersCount <= 0 || playersCount > standardPlayersCount) throw new Error('Invalid players count');

    if (playersCount < 4) {
      while (players.length < standardPlayersCount) {
        players.push(new AIPlayer());
      }
    }
    return players;
  }

  private validateExchangeHandsEvent({ exchangeHandsEvent }: { exchangeHandsEvent: ExchangeHands }): void {
    if (exchangeHandsEvent.isEnded()) {
      // exchange hands back
      exchangeHandsEvent.exchange();
      this.exchangeHandsEvents = this.exchangeHandsEvents.filter(
        (event) => event.requestPlayer.id !== exchangeHandsEvent.requestPlayer.id,
      );
    }
  }

  private async pickExchangeHandsTargetPlayer({ requestPlayer }: { requestPlayer: Player }): Promise<Player['id']> {
    const targetPlayerChoices = this.players
      .filter((player) => player.id !== requestPlayer.id)
      .map((player) => ({ value: `${player}`, name: `${player.name}` }));

    const targetPlayerId = await promptSelect({
      question: `${requestPlayer.name}, Please select a player to exchange hands: `,
      choices: targetPlayerChoices,
    });

    if (!targetPlayerId) throw new Error('No target player');
    return targetPlayerId;
  }

  private showdown({ showCardRecords }: { showCardRecords: ShowCardRecord[] }): void {
    const parsedCards = showCardRecords
      .map((record) => {
        const { suit, rank } = record.card;
        return `${record.playerName} - ${suit}${rank}`;
      })
      .join(' | ');

    console.log('..............');
    console.log(`showdown result:【${parsedCards}】`);
    console.log('..............');
  }

  private judge({ showCardRecords }: { showCardRecords: ShowCardRecord[] }) {
    if (!showCardRecords.length) return;

    // 1. compare rank
    let highestRank = RANK_SCORE[showCardRecords[0].card.rank];

    const candidates = showCardRecords.reduce((candidates, record) => {
      const { rank } = record.card;
      const score = RANK_SCORE[rank];
      if (score > highestRank) {
        highestRank = score;
        return [record];
      }
      if (score === highestRank) {
        candidates.push(record);
      }
      return candidates;
    }, [] as ShowCardRecord[]);

    // 2. compare suit
    let highestSuit = SUIT_SCORE[candidates[0].card.suit];
    let winner = candidates[0];

    const winnerCard = candidates.reduce((winner, candidate) => {
      const { suit } = candidate.card;
      const score = SUIT_SCORE[suit];
      if (score > highestSuit) {
        highestSuit = SUIT_SCORE[suit];
        return candidate;
      }
      return winner;
    }, winner);

    const winnerPlayer = this.players.find((player) => player.id === winnerCard.playerId);
    if (winnerPlayer) {
      winnerPlayer.gainPoint();
      console.log(`${winnerPlayer.name} wins this round!`);
    }
  }
}
