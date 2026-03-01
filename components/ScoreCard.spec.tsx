import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ScoreCard from './ScoreCard';

describe('ScoreCard', () => {
  it('renders score and winStreak', () => {
    render(<ScoreCard score={42} winStreak={3} />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Win Streak: 3')).toBeInTheDocument();
  });

  it('defaults to 0 when score and winStreak are undefined', () => {
    render(<ScoreCard score={undefined} winStreak={undefined} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Win Streak: 0')).toBeInTheDocument();
  });

  it('defaults to 0 when score and winStreak are null', () => {
    render(<ScoreCard score={null} winStreak={null} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Win Streak: 0')).toBeInTheDocument();
  });
});
