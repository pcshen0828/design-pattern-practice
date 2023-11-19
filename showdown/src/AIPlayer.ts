import { Hand } from './Hand';
import { Player } from './Player';

export class AIPlayer extends Player {
  name: string;
  point: number;
  hand: Hand;
  canExchangeHands: boolean;

  constructor() {
    super();
    this.name = '';
    this.point = 0;
    this.hand = new Hand();
    this.canExchangeHands = true;
  }

  nameOneself() {
    this.name = 'AI Player';
  }

  showCard() {
    const cards = this.hand.getCards();
    const card = cards[0];
    if (!card) {
      throw new Error('No more cards to show');
    }
    this.hand.removeCard(card);
    return card;
  }

  exchangeHandOrNot() {
    const answer = Math.random() < 0.5;
    return answer;
  }
}
