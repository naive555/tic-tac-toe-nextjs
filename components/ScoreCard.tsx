'use client';

interface Props {
  score: number;
  winStreak: number;
}

export default function ScoreCard({ score, winStreak }: Props) {
  return (
    <div className="border p-4 rounded w-64 text-center">
      <div className="text-xl font-bold">Score</div>
      <div className="text-3xl">{score}</div>
      <div className="mt-2 text-sm">Win Streak: {winStreak}</div>
    </div>
  );
}
