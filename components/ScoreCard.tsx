'use client';

interface Props {
  score: number | null | undefined;
  winStreak: number | null | undefined;
}

export default function ScoreCard({ score, winStreak }: Props) {
  const displayScore = score ?? 0;
  const displayStreak = winStreak ?? 0;

  return (
    <div className="border dark:border-gray-700 p-4 rounded w-64 text-center dark:bg-gray-900 dark:text-white">
      <div className="text-xl font-bold">Score</div>
      <div className="text-3xl">{displayScore}</div>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Win Streak: {displayStreak}
      </div>
    </div>
  );
}
