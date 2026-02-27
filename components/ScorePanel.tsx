'use client';

import { useEffect, useState } from 'react';
import ScoreCard from './ScoreCard';
import axios from 'axios';

interface Score {
  score: number;
  winStreak: number;
}

export default function ScorePanel() {
  const [score, setScore] = useState<Score | null>(null);

  useEffect(() => {
    axios.get('/api/scores/me').then((res) => {
      setScore(res.data);
    });
  }, []);

  if (!score) return null;

  return <ScoreCard score={score.score} winStreak={score.winStreak} />;
}
