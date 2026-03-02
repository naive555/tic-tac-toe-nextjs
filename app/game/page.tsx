'use client';

import { useState } from 'react';
import GameBoard from '@/components/GameBoard';
import ScorePanel from '@/components/ScorePanel';

export default function GamePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGameFinished = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold dark:text-white">Tic Tac Toe</h1>
      <ScorePanel refreshKey={refreshKey} />
      <GameBoard onFinished={handleGameFinished} />
    </div>
  );
}
