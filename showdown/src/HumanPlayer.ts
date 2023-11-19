import { Hand } from './Hand';
import { Player } from './Player';

let num = 1;

export class HumanPlayer extends Player {
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
    // #TODO
    // get name from command line
    const name = `Human Player${num}`;
    this.name = name;
    num += 1;
  }

  showCard() {
    // #TODO
    // pick card from CLI
    const cards = this.hand.getCards();
    const card = cards[0];
    if (!card) {
      throw new Error('No more cards to show');
    }
    this.hand.removeCard(card);
    return card;
  }

  exchangeHandOrNot() {
    // #TODO
    // get answer from command line
    const answer = Math.random() < 0.5;
    return answer;
  }
}
