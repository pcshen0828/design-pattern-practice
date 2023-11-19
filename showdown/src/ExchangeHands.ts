import { Player } from './Player';

export class ExchangeHands {
  private rounds: number;
  requestPlayer: Player;
  targetPlayer: Player;

  constructor({ requestPlayer, targetPlayer }: { requestPlayer: Player; targetPlayer: Player }) {
    this.rounds = 3;
    this.requestPlayer = requestPlayer;
    this.targetPlayer = targetPlayer;
  }

  countdown() {
    this.rounds -= 1;
  }

  isEnded() {
    return this.rounds === 0;
  }

  exchange() {
    const requestPlayerCards = this.requestPlayer.hand.getCards();
    const targetPlayerCards = this.targetPlayer.hand.getCards();
    this.requestPlayer.updateHand(targetPlayerCards);
    this.targetPlayer.updateHand(requestPlayerCards);
  }
}
