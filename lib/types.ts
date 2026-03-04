export type GameMark = 'X' | 'O' | null;

export type GameResult = 'WIN' | 'LOSE' | 'DRAW' | null;

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface PlayRequest {
  board: GameMark[];
  position: number;
  difficulty: Difficulty;
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
