export type GameMark = 'X' | 'O' | null;

export type GameResult = 'WIN' | 'LOSE' | 'DRAW' | null;

export interface PlayResponse {
  board: GameMark[];
  result: GameResult;
}
