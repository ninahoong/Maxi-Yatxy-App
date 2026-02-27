export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export interface DieState {
  value: DiceValue;
  isHeld: boolean;
}

export type ScoreCategory =
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  | 'onePair'
  | 'twoPairs'
  | 'threePairs'
  | 'threeOfAKind'
  | 'fourOfAKind'
  | 'fiveOfAKind'
  | 'smallStraight'
  | 'largeStraight'
  | 'fullHouse'
  | 'chance'
  | 'maxiYatzy';

export type Scores = Record<ScoreCategory, number | null>;

export interface GameState {
  dice: DieState[];
  rollsLeft: number;
  scores: Scores;
  gameOver: boolean;
}
