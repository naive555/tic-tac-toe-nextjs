import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/'),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const mockUser = { id: 'user-1', username: 'Alice' };

describe('Navbar', () => {
  describe('when logged out', () => {
    it('shows Login link', () => {
      render(<Navbar user={null} />);
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('does not show Logout', () => {
      render(<Navbar user={null} />);
      expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('does not show Leaderboard', () => {
      render(<Navbar user={null} />);
      expect(screen.queryByText('Leaderboard')).not.toBeInTheDocument();
    });
  });

  describe('when logged in', () => {
    it('shows Logout link', () => {
      render(<Navbar user={mockUser} />);
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('shows username as nav item', () => {
      render(<Navbar user={mockUser} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });

    it('shows Leaderboard link', () => {
      render(<Navbar user={mockUser} />);
      expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    });

    it('does not show Login', () => {
      render(<Navbar user={mockUser} />);
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });
  });

  describe('active link', () => {
    it('highlights active route', async () => {
      const { usePathname } = await import('next/navigation');
      vi.mocked(usePathname).mockReturnValue('/leaderboard');

      render(<Navbar user={mockUser} />);

      const leaderboardLink = screen.getByText('Leaderboard').closest('a');
      expect(leaderboardLink).toHaveClass('bg-black', 'text-white');
    });

    it('does not highlight inactive route', async () => {
      const { usePathname } = await import('next/navigation');
      vi.mocked(usePathname).mockReturnValue('/');

      render(<Navbar user={mockUser} />);

      const leaderboardLink = screen.getByText('Leaderboard').closest('a');
      expect(leaderboardLink).not.toHaveClass('bg-black');
    });
  });
});
