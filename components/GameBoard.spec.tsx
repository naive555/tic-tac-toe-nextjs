import type { GameMark, GameResult } from '@/lib/types';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as gameApi from '../lib/game.api';
import GameBoard from './GameBoard';

vi.mock('../lib/game.api');

const mockStartGame = vi.mocked(gameApi.startGame);
const mockMakeMove = vi.mocked(gameApi.makeMove);

const emptyBoard: GameMark[] = Array(9).fill(null);

const mockGameId = 'game-123';

const mockStartResponse = () => Promise.resolve({ data: { id: mockGameId } });

const mockMoveResponse = (board: GameMark[], result: GameResult) =>
  Promise.resolve({ data: { board, result } });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GameBoard', () => {
  describe('Initial render', () => {
    it('renders 9 empty cells and reset button', () => {
      render(<GameBoard />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(10); // 9 cells + reset
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    it('cells are enabled initially', () => {
      render(<GameBoard />);
      const cells = screen.getAllByRole('button').slice(0, 9);
      cells.forEach((cell) => expect(cell).toBeEnabled());
    });
  });

  describe('handleMove', () => {
    it('calls startGame then makeMove on first cell click', async () => {
      const user = userEvent.setup();
      mockStartGame.mockResolvedValueOnce(mockStartResponse() as never);
      mockMakeMove.mockResolvedValueOnce(
        mockMoveResponse(emptyBoard, null) as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      expect(mockStartGame).toHaveBeenCalledTimes(1);
      expect(mockMakeMove).toHaveBeenCalledWith(mockGameId, 0);
    });

    it('does not call startGame again on second move', async () => {
      const user = userEvent.setup();
      mockStartGame.mockResolvedValueOnce(mockStartResponse() as never);
      mockMakeMove
        .mockResolvedValueOnce(mockMoveResponse(emptyBoard, null) as never)
        .mockResolvedValueOnce(mockMoveResponse(emptyBoard, null) as never);

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);
      await user.click(screen.getAllByRole('button')[1]);

      expect(mockStartGame).toHaveBeenCalledTimes(1);
      expect(mockMakeMove).toHaveBeenCalledTimes(2);
      expect(mockMakeMove).toHaveBeenNthCalledWith(2, mockGameId, 1);
    });

    it('disables all cells while loading', async () => {
      const user = userEvent.setup();
      mockStartGame.mockResolvedValueOnce(mockStartResponse() as never);
      mockMakeMove.mockReturnValueOnce(new Promise(() => {}));

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      const cells = screen.getAllByRole('button').slice(0, 9);
      cells.forEach((cell) => expect(cell).toBeDisabled());
    });

    it('does not call makeMove on already-filled cell', async () => {
      const user = userEvent.setup();
      const boardWithX = ['X', ...Array(8).fill(null)] as GameMark[];
      mockStartGame.mockResolvedValueOnce(mockStartResponse() as never);
      mockMakeMove.mockResolvedValueOnce(
        mockMoveResponse(boardWithX, null) as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);
      await waitFor(() => expect(mockMakeMove).toHaveBeenCalledTimes(1));

      await user.click(screen.getAllByRole('button')[0]);
      expect(mockMakeMove).toHaveBeenCalledTimes(1);
    });

    it('shows error message when startGame throws', async () => {
      const user = userEvent.setup();
      mockStartGame.mockRejectedValueOnce(new Error('Network error'));

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(
          screen.getByText('Something went wrong. Please try again.'),
        ).toBeInTheDocument();
      });
    });

    it('shows error message when makeMove throws', async () => {
      const user = userEvent.setup();
      mockStartGame.mockResolvedValueOnce(mockStartResponse() as never);
      mockMakeMove.mockRejectedValueOnce(new Error('Network error'));

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
      mockStartGame.mockResolvedValueOnce(mockStartResponse() as never);
      mockMakeMove.mockResolvedValueOnce(
        mockMoveResponse(emptyBoard, 'WIN') as never,
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
      mockStartGame.mockResolvedValueOnce(mockStartResponse() as never);
      mockMakeMove.mockResolvedValueOnce(
        mockMoveResponse(emptyBoard, 'LOSE') as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(screen.getByText('You Lose 😢')).toBeInTheDocument();
      });
    });

    it('shows DRAW message', async () => {
      const user = userEvent.setup();
      mockStartGame.mockResolvedValueOnce(mockStartResponse() as never);
      mockMakeMove.mockResolvedValueOnce(
        mockMoveResponse(emptyBoard, 'DRAW') as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);

      await waitFor(() => {
        expect(screen.getByText('Draw 🤝')).toBeInTheDocument();
      });
    });

    it('disables cells after game ends', async () => {
      const user = userEvent.setup();
      mockStartGame.mockResolvedValueOnce(mockStartResponse() as never);
      mockMakeMove.mockResolvedValueOnce(
        mockMoveResponse(emptyBoard, 'WIN') as never,
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
    it('clears board, result, and gameId after reset', async () => {
      const user = userEvent.setup();
      mockStartGame.mockResolvedValueOnce(mockStartResponse() as never);
      mockMakeMove.mockResolvedValueOnce(
        mockMoveResponse(emptyBoard, 'WIN') as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);
      await waitFor(() => screen.getByText('You Win 🎉'));

      await user.click(screen.getByText('Reset'));

      expect(screen.queryByText('You Win 🎉')).not.toBeInTheDocument();
      const cells = screen.getAllByRole('button').slice(0, 9);
      cells.forEach((cell) => expect(cell).toHaveTextContent(''));
    });

    it('calls startGame again after reset', async () => {
      const user = userEvent.setup();
      mockStartGame.mockResolvedValue(mockStartResponse() as never);
      mockMakeMove.mockResolvedValue(
        mockMoveResponse(emptyBoard, null) as never,
      );

      render(<GameBoard />);
      await user.click(screen.getAllByRole('button')[0]);
      await waitFor(() => expect(mockMakeMove).toHaveBeenCalledTimes(1));

      await user.click(screen.getByText('Reset'));
      await user.click(screen.getAllByRole('button')[0]);

      expect(mockStartGame).toHaveBeenCalledTimes(2);
    });

    it('clears error message after reset', async () => {
      const user = userEvent.setup();
      mockStartGame.mockRejectedValueOnce(new Error('fail'));

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
