import axios from 'axios';

import { Difficulty, StartGameResponse, PlayResponse } from './types';

export const startGame = (difficulty: Difficulty) =>
  axios.post<StartGameResponse>('/api/game/start', { difficulty });

export const makeMove = (gameId: string, position: number) =>
  axios.post<PlayResponse>(`/api/game/${gameId}/move`, { position });
