'use client';

import { useState } from 'react';
import { GameMark, GameResult, PlayResponse } from '@/lib/types';
import axios from 'axios';

const createEmptyBoard = (): GameMark[] => Array(9).fill(null);

type Props = {
  onFinished?: () => void;
};

export default function GameBoard({ onFinished }: Props) {
  const [board, setBoard] = useState<GameMark[]>(createEmptyBoard());
  const [result, setResult] = useState<GameResult>(null);
  const [loading, setLoading] = useState(false);

  const handleMove = async (index: number) => {
    if (board[index] || result || loading) return;

    try {
      setLoading(true);

      const res = await axios.post<PlayResponse>('/api/game/play', {
        board,
        position: index,
      });

      setBoard(res.data.board);
      setResult(res.data.result);

      if (res.data.result) {
        onFinished?.();
      }
    } catch (error) {
      console.error('[GameBoard.handleMove] Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setBoard(createEmptyBoard());
    setResult(null);
    setLoading(false);
  };

  const getResultStyle = () => {
    switch (result) {
      case 'WIN':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'LOSE':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'DRAW':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 text-sm font-medium">
            Thinking...
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleMove(i)}
              disabled={loading || !!result}
              className="
                w-20 h-20
                border
                text-2xl font-bold
                flex items-center justify-center
                transition
                hover:bg-gray-100
                disabled:opacity-60
                disabled:cursor-not-allowed
              ">
              {cell}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div
          className={`px-4 py-2 border rounded font-semibold ${getResultStyle()}`}>
          {result === 'WIN' && 'You Win 🎉'}
          {result === 'LOSE' && 'You Lose 😢'}
          {result === 'DRAW' && 'Draw 🤝'}
        </div>
      )}

      <button
        onClick={reset}
        disabled={loading}
        className="
          px-4 py-2
          border
          rounded
          transition
          hover:bg-gray-100
          disabled:opacity-60
        ">
        Reset
      </button>
    </div>
  );
}
