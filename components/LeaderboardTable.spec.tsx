import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LeaderboardTable from './LeaderboardTable';
import type { Score } from '@/lib/types';

const mockScores: Score[] = [
  {
    id: 'user-1',
    score: 30,
    winStreak: 2,
    username: 'alice',
    user: { id: 'user-1', oauthId: 'o1', email: 'alice@test.com' },
  },
  {
    id: 'user-2',
    score: 50,
    winStreak: 5,
    username: 'bob',
    user: { id: 'user-2', oauthId: 'o2', email: 'bob@test.com' },
  },
  {
    id: 'user-3',
    score: 10,
    winStreak: 0,
    username: 'carol',
    user: { id: 'user-3', oauthId: 'o3', email: 'carol@test.com' },
  },
];

describe('LeaderboardTable', () => {
  it('renders all players', () => {
    render(<LeaderboardTable scores={mockScores} currentUserId={null} />);

    expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    expect(screen.getByText('bob@test.com')).toBeInTheDocument();
    expect(screen.getByText('carol@test.com')).toBeInTheDocument();
  });

  it('sorts by score descending', () => {
    render(<LeaderboardTable scores={mockScores} currentUserId={null} />);

    const rows = screen.getAllByRole('row').slice(1); // skip header
    expect(rows[0]).toHaveTextContent('bob@test.com'); // 50
    expect(rows[1]).toHaveTextContent('alice@test.com'); // 30
    expect(rows[2]).toHaveTextContent('carol@test.com'); // 10
  });

  it('assigns correct rank numbers', () => {
    render(<LeaderboardTable scores={mockScores} currentUserId={null} />);

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('1');
    expect(rows[1]).toHaveTextContent('2');
    expect(rows[2]).toHaveTextContent('3');
  });

  it('highlights current user row', () => {
    render(<LeaderboardTable scores={mockScores} currentUserId="user-1" />);

    const rows = screen.getAllByRole('row').slice(1);
    const aliceRow = rows.find((r) =>
      r.textContent?.includes('alice@test.com'),
    );
    expect(aliceRow).toHaveClass('bg-blue-50');
  });

  it('does not highlight any row when currentUserId is null', () => {
    render(<LeaderboardTable scores={mockScores} currentUserId={null} />);

    const rows = screen.getAllByRole('row').slice(1);
    rows.forEach((row) => expect(row).not.toHaveClass('bg-blue-50'));
  });

  it('renders empty table when no scores', () => {
    render(<LeaderboardTable scores={[]} currentUserId={null} />);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1); // header only
  });
});
