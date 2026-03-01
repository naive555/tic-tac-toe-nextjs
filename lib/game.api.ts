import axios from 'axios';

import { PlayRequest, PlayResponse } from './types';

export const playGame = (payload: PlayRequest) =>
  axios.post<PlayResponse>('/api/game/play', payload);
