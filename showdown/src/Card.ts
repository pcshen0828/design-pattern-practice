import { Rank } from './rank';
import { Suit } from './suit';

export class Card {
  readonly rank: Rank;
  readonly suit: Suit;

  constructor({ rank, suit }: { rank: Rank; suit: Suit }) {
    if (!(rank satisfies Rank) || !(suit satisfies Suit)) throw new Error('Invalid rank or suit');
    this.rank = rank;
    this.suit = suit;
  }
}
