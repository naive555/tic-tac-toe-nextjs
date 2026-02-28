'use client';

import { useEffect, useState } from 'react';
import ScoreCard from './ScoreCard';
import axios from 'axios';

interface Score {
  score: number;
  winStreak: number;
}

type Props = {
  refreshKey: number;
};

export default function ScorePanel({ refreshKey }: Props) {
  const [score, setScore] = useState<Score | null>(null);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/scores/me');
      setScore(res.data);
    } catch (error) {
      console.error('[ScorePanel.fetchData] Failed:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  return <ScoreCard score={score?.score} winStreak={score?.winStreak} />;
}
