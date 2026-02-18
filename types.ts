
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum GameMode {
  MENU = 'menu',
  NORMAL = 'normal',
  MEMORIZE = 'memorize',
  HALL_OF_FAME = 'hall_of_fame'
}

export interface Question {
  m: number;
  n: number;
  answer: number;
  options: number[];
}

export interface HallOfFameEntry {
  id: string;
  name: string;
  score: number;
  total: number;
  mode: GameMode;
  difficulty?: Difficulty;
  selectedSifir?: number | null;
  date: string;
}

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  selectedSifir: number | null;
  selectedRange: [number, number] | null;
  currentQuestionIndex: number;
  score: number;
  questions: Question[];
  isGameOver: boolean;
}

export interface ChoiceState {
    value: number;
    status: 'idle' | 'correct' | 'incorrect' | 'missed';
}
