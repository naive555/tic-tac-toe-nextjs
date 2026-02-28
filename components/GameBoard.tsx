'use client';

import { useState } from 'react';
import { GameMark, GameResult, PlayResponse } from '@/lib/types';
import axios from 'axios';

const emptyBoard: GameMark[] = Array(9).fill(null);

type Props = {
  onFinished?: () => void;
};

export default function GameBoard({ onFinished }: Props) {
  const [board, setBoard] = useState<GameMark[]>(emptyBoard);
  const [result, setResult] = useState<GameResult>(null);
  const [loading, setLoading] = useState(false);

  const handleMove = async (index: number) => {
    if (board[index] || result) return;

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
    setBoard(emptyBoard);
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleMove(i)}
            disabled={loading || !!result}
            className="w-20 h-20 border text-2xl font-bold">
            {cell}
          </button>
        ))}
      </div>

      {result && <div className="text-lg font-semibold">Result: {result}</div>}

      <button onClick={reset} className="px-4 py-2 border rounded">
        Reset
      </button>
    </div>
  );
}
