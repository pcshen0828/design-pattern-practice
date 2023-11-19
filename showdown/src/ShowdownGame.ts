import { AIPlayer } from './AIPlayer';
import { Card } from './Card';
import { Deck } from './Deck';
import { ExchangeHands } from './ExchangeHands';
import { Player } from './Player';
import { RANK_SCORE } from './rank';
import { SUIT_SCORE } from './suit';

type ShownCard = { card: Card; playerId: number };

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

  start(): void {
    console.log('======= Game start! =======');
    // #TODO
    // handle async CLI input
    this.players.forEach((player) => {
      player.nameOneself();
    });

    this.deck.shuffle();
  }

  distributeCards(): void {
    console.log('Players are drawing cards...');
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

  takeTurns(): void {
    while (this.round <= 13) {
      console.log(`--- Round ${this.round} ---`);

      this.exchangeHandsEvents.forEach((exchangeHandsEvent) => {
        exchangeHandsEvent.countdown();
        this.validateExchangeHandsEvent({ exchangeHandsEvent });
      });

      const shownCards: ShownCard[] = [];

      this.players.forEach((player) => {
        if (player.canExchangeHands) {
          const doExchangeHands = player.exchangeHandOrNot();

          if (doExchangeHands) {
            const targetPlayer = this.pickExchangeHandsTargetPlayer({ requestPlayer: player });

            const exchangeHandsEvent = new ExchangeHands({ requestPlayer: player, targetPlayer });
            this.exchangeHandsEvents.push(exchangeHandsEvent);
            exchangeHandsEvent.exchange();
          }
        }

        if (player.hasCard()) {
          const card = player.showCard();
          shownCards.push({ card, playerId: player.id });
        }
      });

      this.showdown({ shownCards });
      this.judge({ shownCards });
      this.round++;
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
      exchangeHandsEvent.exchangeBack();
      this.exchangeHandsEvents = this.exchangeHandsEvents.filter(
        (event) => event.requestPlayer.id !== exchangeHandsEvent.requestPlayer.id,
      );
    }
  }

  private pickExchangeHandsTargetPlayer({ requestPlayer }: { requestPlayer: Player }) {
    // #TODO
    // pick target player from CLI
    const targetPlayer = this.players.find((player) => player.id !== requestPlayer.id);
    if (!targetPlayer) throw new Error('No target player');
    return targetPlayer;
  }

  private showdown({ shownCards }: { shownCards: ShownCard[] }): void {
    const parsedCards = shownCards
      .map((shownCard) => {
        const { suit, rank } = shownCard.card;
        return `P${shownCard.playerId}-${suit}${rank}`;
      })
      .join(', ');

    console.log(`showdown 【${parsedCards}】`);
  }

  private judge({ shownCards }: { shownCards: ShownCard[] }) {
    if (!shownCards.length) return;

    // 1. compare rank
    let highestRank = RANK_SCORE[shownCards[0].card.rank];

    const candidates = shownCards.reduce((candidates, shownCard) => {
      const { rank } = shownCard.card;
      const score = RANK_SCORE[rank];
      if (score > highestRank) {
        highestRank = score;
        return [shownCard];
      }
      if (score === highestRank) {
        candidates.push(shownCard);
      }
      return candidates;
    }, [] as ShownCard[]);

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
    }
  }
}
