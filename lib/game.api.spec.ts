import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { playGame } from './game.api';
import { Difficulty, type PlayRequest } from './types';

vi.mock('axios');

const mockPost = vi.mocked(axios.post);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('playGame', () => {
  it('posts to /api/game/play with payload', async () => {
    const payload: PlayRequest = {
      board: Array(9).fill(null),
      position: 4,
      difficulty: Difficulty.MEDIUM,
    };
    mockPost.mockResolvedValueOnce({ data: { board: [], result: null } });

    await playGame(payload);

    expect(mockPost).toHaveBeenCalledWith('/api/game/play', payload);
  });

  it('returns axios response', async () => {
    const payload: PlayRequest = {
      board: Array(9).fill(null),
      position: 0,
      difficulty: Difficulty.MEDIUM,
    };
    const mockData = { board: ['X', ...Array(8).fill(null)], result: null };
    mockPost.mockResolvedValueOnce({ data: mockData });

    const res = await playGame(payload);

    expect(res.data).toEqual(mockData);
  });

  it('throws when axios throws', async () => {
    const payload: PlayRequest = {
      board: Array(9).fill(null),
      position: 0,
      difficulty: Difficulty.MEDIUM,
    };
    mockPost.mockRejectedValueOnce(new Error('Network error'));

    await expect(playGame(payload)).rejects.toThrow('Network error');
  });
});
