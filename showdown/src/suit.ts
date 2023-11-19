export type Suit = 'Spade' | 'Heart' | 'Diamond' | 'Club';

export const SUIT_SCORE = {
  Spade: 3,
  Heart: 2,
  Diamond: 1,
  Club: 0,
} as const;
