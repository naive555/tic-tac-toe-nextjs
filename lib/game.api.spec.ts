import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { startGame, makeMove } from './game.api';
import { Difficulty } from './types';

vi.mock('axios');

const mockPost = vi.mocked(axios.post);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('startGame', () => {
  it('posts to /api/game/start with difficulty', async () => {
    mockPost.mockResolvedValueOnce({ data: { id: 'game-123' } });

    await startGame(Difficulty.MEDIUM);

    expect(mockPost).toHaveBeenCalledWith('/api/game/start', {
      difficulty: Difficulty.MEDIUM,
    });
  });

  it('returns game id', async () => {
    mockPost.mockResolvedValueOnce({ data: { id: 'game-123' } });

    const res = await startGame(Difficulty.HARD);

    expect(res.data.id).toBe('game-123');
  });

  it('throws when axios throws', async () => {
    mockPost.mockRejectedValueOnce(new Error('Network error'));

    await expect(startGame(Difficulty.EASY)).rejects.toThrow('Network error');
  });
});

describe('makeMove', () => {
  it('posts to /api/game/:id/move with position', async () => {
    mockPost.mockResolvedValueOnce({ data: { board: [], result: null } });

    await makeMove('game-123', 4);

    expect(mockPost).toHaveBeenCalledWith('/api/game/game-123/move', {
      position: 4,
    });
  });

  it('returns board and result', async () => {
    const mockData = { board: ['X', ...Array(8).fill(null)], result: null };
    mockPost.mockResolvedValueOnce({ data: mockData });

    const res = await makeMove('game-123', 0);

    expect(res.data).toEqual(mockData);
  });

  it('throws when axios throws', async () => {
    mockPost.mockRejectedValueOnce(new Error('Network error'));

    await expect(makeMove('game-123', 0)).rejects.toThrow('Network error');
  });
});
