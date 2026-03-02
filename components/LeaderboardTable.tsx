'use client';

import { Score } from '@/lib/types';

type Props = {
  scores: Score[];
  currentUserId: string | null;
};

export default function LeaderboardTable({ scores, currentUserId }: Props) {
  const sorted = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="p-4 dark:text-gray-300">Rank</th>
            <th className="p-4 dark:text-gray-300">Player</th>
            <th className="p-4 dark:text-gray-300">Score</th>
            <th className="p-4 dark:text-gray-300">Streak</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, index) => (
            <tr
              key={s.id}
              className={`border-t dark:border-gray-700 ${
                s.id === currentUserId
                  ? 'bg-blue-50 dark:bg-blue-950'
                  : 'dark:hover:bg-gray-800'
              }`}>
              <td className="p-4 font-medium dark:text-gray-300">
                {index + 1}
              </td>
              <td className="p-4 dark:text-gray-300">{s.user.email}</td>
              <td className="p-4 font-bold dark:text-white">{s.score}</td>
              <td className="p-4 dark:text-gray-300">{s.winStreak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
