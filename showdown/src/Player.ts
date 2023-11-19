import { Card } from './Card';
import { Hand } from './Hand';

let num = 1;

export abstract class Player {
  id: string;
  abstract name: string;
  abstract point: number;
  abstract hand: Hand;
  abstract canExchangeHands: boolean;

  constructor() {
    this.id = `${num}`;
    num += 1;
  }

  abstract nameOneself(): void;

  abstract showCard(): Promise<Card>;

  abstract exchangeHandOrNot(): Promise<boolean>;

  gainPoint() {
    this.point += 1;
  }

  hasCard() {
    return this.hand.getCards().length > 0;
  }

  forbidExchangeHands() {
    // every player can only exchange hands once
    this.canExchangeHands = false;
  }

  updateHand(cards: Card[]) {
    this.hand.updateCards(cards);
  }
}
