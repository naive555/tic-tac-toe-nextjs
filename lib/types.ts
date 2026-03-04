export type GameMark = 'X' | 'O' | null;

export type GameResult = 'WIN' | 'LOSE' | 'DRAW' | null;

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export interface StartGameResponse {
  id: string;
}

export interface PlayResponse {
  board: GameMark[];
  result: GameResult;
}

export type Score = {
  id: string;
  username: string;
  score: number;
  winStreak: number;

  user: User;
};

export type User = {
  id: string;
  oauthId: string;
  email: string;
};
