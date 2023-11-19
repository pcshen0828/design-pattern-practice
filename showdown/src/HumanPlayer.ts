import { Hand } from './Hand';
import { Player } from './Player';
import { promptConfirm, promptSelect, promptUserInput } from './helper';

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

  async nameOneself() {
    const name = await promptUserInput({ question: `User${this.id}, please enter your name:` });
    this.name = name;
  }

  async showCard() {
    const cards = this.hand.getCards();
    const cardChoices = cards.map((card, index) => ({ value: `${index}`, name: `${card.suit}${card.rank}` }));
    const cardToShowIndex = await promptSelect({
      question: `${this.name}, please select a card to show:`,
      choices: cardChoices,
      pageSize: 13,
    });

    const cardToShow = cards[Number(cardToShowIndex)];
    if (!cardToShow) {
      throw new Error('No more cards to show');
    }
    this.hand.removeCard(cardToShow);
    return cardToShow;
  }

  async exchangeHandOrNot() {
    const answer = await promptConfirm({
      question: `${this.name}, do you want to exchange your hand?`,
    });
    return answer;
  }
}
