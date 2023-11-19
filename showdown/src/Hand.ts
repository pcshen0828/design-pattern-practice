import { Card } from './Card';

export class Hand {
  private cards: Card[];

  constructor() {
    this.cards = [];
  }

  getCards(): Card[] {
    return [...this.cards];
  }

  addCard(card: Card): void {
    if (this.cards.length >= 13) throw new Error('Hand is full');
    this.cards = [...this.cards, card];
  }

  removeCard(card: Card): void {
    const newCards = this.cards.filter((c) => !(c.suit === card.suit && c.rank === card.rank));
    this.cards = newCards;
  }

  updateCards(cards: Card[]): void {
    this.cards = cards;
  }
}
