'use client';

import { useState } from 'react';
import { Difficulty, GameMark, GameResult } from '@/lib/types';
import { playGame } from '@/lib/game.api';

const createEmptyBoard = (): GameMark[] => Array(9).fill(null);

const RESULT_STYLES: Record<string, string> = {
  WIN: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700',
  LOSE: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700',
  DRAW: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700',
};

const RESULT_MESSAGES: Record<string, string> = {
  WIN: 'You Win 🎉',
  LOSE: 'You Lose 😢',
  DRAW: 'Draw 🤝',
};

type Props = {
  onFinished?: () => void;
};

export default function GameBoard({ onFinished }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [board, setBoard] = useState<GameMark[]>(createEmptyBoard());
  const [result, setResult] = useState<GameResult>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMove = async (index: number) => {
    if (board[index] || result || loading) return;

    try {
      setLoading(true);
      setError(null);

      const res = await playGame({ board, position: index, difficulty });

      setBoard(res.data.board);
      setResult(res.data.result);

      if (res.data.result) {
        onFinished?.();
      }
    } catch (err) {
      console.error('[GameBoard.handleMove] Failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    if (loading) return;
    setBoard(createEmptyBoard());
    setResult(null);
    setError(null);
  };

  const gameStarted = board.some((cell) => cell !== null);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium dark:text-gray-300">
          Difficulty:
        </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          disabled={gameStarted || !!result || loading}
          className="text-sm border dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white rounded px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed">
          <option value={Difficulty.EASY}>Easy</option>
          <option value={Difficulty.MEDIUM}>Medium</option>
          <option value={Difficulty.HARD}>Hard</option>
        </select>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-10 text-sm font-medium dark:text-white">
            Thinking...
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <button
              key={`cell-${i}`}
              onClick={() => handleMove(i)}
              disabled={loading || !!result}
              className="w-20 h-20 border dark:border-gray-600 bg-white dark:bg-gray-900 text-2xl font-bold flex items-center justify-center transition hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed">
              {cell}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {result && (
        <div
          className={`px-4 py-2 border rounded font-semibold ${RESULT_STYLES[result]}`}>
          {RESULT_MESSAGES[result]}
        </div>
      )}

      <button
        onClick={reset}
        disabled={loading}
        className="px-4 py-2 border dark:border-gray-600 bg-white dark:bg-gray-900 rounded transition hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white disabled:opacity-60">
        Reset
      </button>
    </div>
  );
}
