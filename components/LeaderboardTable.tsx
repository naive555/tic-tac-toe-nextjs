'use client';

type Score = {
  id: string;
  username: string;
  score: number;
  win: number;
  lose: number;
  draw: number;
};

type Props = {
  scores: Score[];
  currentUserId: string | null;
};

export default function LeaderboardTable({ scores, currentUserId }: Props) {
  const sorted = [...scores].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4">Rank</th>
            <th className="p-4">Player</th>
            <th className="p-4">Score</th>
            <th className="p-4">W</th>
            <th className="p-4">L</th>
            <th className="p-4">D</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, index) => (
            <tr
              key={s.id}
              className={`border-t ${
                s.id === currentUserId ? 'bg-blue-50' : ''
              }`}>
              <td className="p-4 font-medium">{index + 1}</td>
              <td className="p-4">{s.username}</td>
              <td className="p-4 font-bold">{s.score}</td>
              <td className="p-4">{s.win}</td>
              <td className="p-4">{s.lose}</td>
              <td className="p-4">{s.draw}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
