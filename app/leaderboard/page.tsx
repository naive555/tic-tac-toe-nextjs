'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

import LeaderboardTable from '@/components/LeaderboardTable';
import { Score } from '@/lib/types';

export default function LeaderboardPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      await Promise.all([
        axios.get('/api/scores/me').then((res) => {
          setCurrentUserId(res.data.id as string);
        }),
        axios.get('/api/scores').then((res) => {
          setScores(res.data as Score[]);
          setLoading(false);
        }),
      ]);
    } catch (error) {
      console.error('[LeaderboardPage.fetchData] Failed:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>

      <LeaderboardTable scores={scores} currentUserId={currentUserId} />
    </div>
  );
}
