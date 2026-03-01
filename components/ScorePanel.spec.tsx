import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import ScorePanel from './ScorePanel';

vi.mock('axios');
vi.mock('./ScoreCard', () => ({
  default: ({ score, winStreak }: { score?: number; winStreak?: number }) => (
    <div>
      <span data-testid="score">{score ?? '-'}</span>
      <span data-testid="win-streak">{winStreak ?? '-'}</span>
    </div>
  ),
}));

const mockGet = vi.mocked(axios.get);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ScorePanel', () => {
  it('fetches and displays score on mount', async () => {
    mockGet.mockResolvedValueOnce({ data: { score: 42, winStreak: 3 } });

    render(<ScorePanel refreshKey={0} />);

    await waitFor(() => {
      expect(screen.getByTestId('score')).toHaveTextContent('42');
      expect(screen.getByTestId('win-streak')).toHaveTextContent('3');
    });

    expect(mockGet).toHaveBeenCalledWith('/api/scores/me');
  });

  it('renders with null score before fetch completes', () => {
    mockGet.mockReturnValueOnce(new Promise(() => {}));

    render(<ScorePanel refreshKey={0} />);

    expect(screen.getByTestId('score')).toHaveTextContent('-');
    expect(screen.getByTestId('win-streak')).toHaveTextContent('-');
  });

  it('refetches when refreshKey changes', async () => {
    mockGet
      .mockResolvedValueOnce({ data: { score: 10, winStreak: 1 } })
      .mockResolvedValueOnce({ data: { score: 20, winStreak: 2 } });

    const { rerender } = render(<ScorePanel refreshKey={0} />);
    await waitFor(() =>
      expect(screen.getByTestId('score')).toHaveTextContent('10'),
    );

    rerender(<ScorePanel refreshKey={1} />);
    await waitFor(() =>
      expect(screen.getByTestId('score')).toHaveTextContent('20'),
    );

    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it('handles fetch error gracefully without crashing', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'));

    render(<ScorePanel refreshKey={0} />);

    await waitFor(() => {
      expect(screen.getByTestId('score')).toHaveTextContent('-');
    });
  });
});
