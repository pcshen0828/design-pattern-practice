import { Card } from './Card';
import { Rank } from './rank';
import { Suit } from './suit';

export class Deck {
  private cards: Card[] = [];

  constructor() {
    this.createDeck();
  }

  private createDeck() {
    const suits: Suit[] = ['Spade', 'Heart', 'Diamond', 'Club'];
    const ranks: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
    const cards = suits.flatMap((suit) => ranks.map((rank) => new Card({ rank, suit })));
    this.cards = cards;
  }

  shuffle() {
    // Fisher–Yates Shuffle
    // reference: https://bost.ocks.org/mike/shuffle/
    let remainedCardsCount = this.cards.length;
    let remainedCardToSwap;
    let randomCardIndex;

    while (remainedCardsCount) {
      randomCardIndex = Math.floor(Math.random() * remainedCardsCount--);

      remainedCardToSwap = this.cards[remainedCardsCount];
      this.cards[remainedCardsCount] = this.cards[randomCardIndex];
      this.cards[randomCardIndex] = remainedCardToSwap;
    }
  }

  drawCard(): Card {
    const card = this.cards.pop();
    if (!card) {
      throw new Error('No more cards to draw');
    }
    return card;
  }
}
