import type { GameMark, GameResult } from '@/lib/types';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as gameApi from '../lib/game.api';
import GameBoard from './GameBoard';

vi.mock('../lib/game.api');

const mockPlayGame = vi.mocked(gameApi.playGame);

const emptyBoard: GameMark[] = Array(9).fill(null);

const mockResponse = (board: GameMark[], result: GameResult) =>
  Promise.resolve({ data: { board, result } });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GameBoard', () => {
  describe('Initial render', () => {
    it('renders 9 empty cells and reset button', () => {
      render(<GameBoard />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(10);
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('cells are enabled initially', () => {
      render(<GameBoard />);
      const cells = screen.getAllByRole('button').slice(0, 9);
      cells.forEach((cell) => expect(cell).toBeEnabled());
    });
  });

  describe('handleMove', () => {
    it('calls playGame with correct args on cell click', async () => {
      const user = userEvent.setup();
      mockPlayGame.mockResolvedValueOnce(
        mockResponse(emptyBoard, null) as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      expect(mockPlayGame).toHaveBeenCalledWith({
        board: emptyBoard,
        position: 0,
      });
    });

    it('disables all cells while loading', async () => {
      const user = userEvent.setup();

      // never resolves, stays loading
      mockPlayGame.mockReturnValueOnce(new Promise(() => {}));

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      const cells = screen.getAllByRole('button').slice(0, 9);
      cells.forEach((cell) => expect(cell).toBeDisabled());
    });

    it('does not call playGame on already-filled cell', async () => {
      const user = userEvent.setup();
      const boardWithX = ['X', ...Array(8).fill(null)];
      mockPlayGame.mockResolvedValueOnce(
        mockResponse(boardWithX, null) as never,
      );

      render(<GameBoard />);

      // click cell 0 to fill it
      await user.click(screen.getAllByRole('button')[0]);

      // click again
      await user.click(screen.getAllByRole('button')[0]);

      expect(mockPlayGame).toHaveBeenCalledTimes(1);
    });

    it('shows error message when playGame throws', async () => {
      const user = userEvent.setup();
      mockPlayGame.mockRejectedValueOnce(new Error('Network error'));

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(
          screen.getByText('Something went wrong. Please try again.'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Game result', () => {
    it('shows WIN message and calls onFinished', async () => {
      const user = userEvent.setup();
      const onFinished = vi.fn();
      mockPlayGame.mockResolvedValueOnce(
        mockResponse(emptyBoard, 'WIN') as never,
      );

      render(<GameBoard onFinished={onFinished} />);
      await user.click(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(screen.getByText('You Win 🎉')).toBeInTheDocument();
        expect(onFinished).toHaveBeenCalledTimes(1);
      });
    });

    it('shows LOSE message', async () => {
      const user = userEvent.setup();
      mockPlayGame.mockResolvedValueOnce(
        mockResponse(emptyBoard, 'LOSE') as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(screen.getByText('You Lose 😢')).toBeInTheDocument();
      });
    });

    it('shows DRAW message', async () => {
      const user = userEvent.setup();
      mockPlayGame.mockResolvedValueOnce(
        mockResponse(emptyBoard, 'DRAW') as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(screen.getByText('Draw 🤝')).toBeInTheDocument();
      });
    });

    it('disables cells after game ends', async () => {
      const user = userEvent.setup();
      mockPlayGame.mockResolvedValueOnce(
        mockResponse(emptyBoard, 'WIN') as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        const cells = screen.getAllByRole('button').slice(0, 9);
        cells.forEach((cell) => expect(cell).toBeDisabled());
      });
    });
  });

  describe('Reset', () => {
    it('clears board and result after reset', async () => {
      const user = userEvent.setup();
      mockPlayGame.mockResolvedValueOnce(
        mockResponse(emptyBoard, 'WIN') as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      await waitFor(() => screen.getByText('You Win 🎉'));

      await user.click(screen.getByText('Reset'));

      expect(screen.queryByText('You Win 🎉')).not.toBeInTheDocument();
      const cells = screen.getAllByRole('button').slice(0, 9);
      cells.forEach((cell) => expect(cell).toHaveTextContent(''));
    });

    it('clears error message after reset', async () => {
      const user = userEvent.setup();
      mockPlayGame.mockRejectedValueOnce(new Error('fail'));

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);
      await waitFor(() =>
        screen.getByText('Something went wrong. Please try again.'),
      );

      await user.click(screen.getByText('Reset'));
      expect(
        screen.queryByText('Something went wrong. Please try again.'),
      ).not.toBeInTheDocument();
    });
  });
});
