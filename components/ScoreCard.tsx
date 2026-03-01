'use client';

interface Props {
  score: number | null | undefined;
  winStreak: number | null | undefined;
}

export default function ScoreCard({ score, winStreak }: Props) {
  const displayScore = score ?? 0;
  const displayStreak = winStreak ?? 0;

  return (
    <div className="border p-4 rounded w-64 text-center">
      <div className="text-xl font-bold">Score</div>
      <div className="text-3xl">{displayScore}</div>
      <div className="mt-2 text-sm">Win Streak: {displayStreak}</div>
    </div>
  );
}
