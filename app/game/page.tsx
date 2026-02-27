import GameBoard from '@/components/GameBoard';
import ScorePanel from '@/components/ScorePanel';

export default function GamePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
      <ScorePanel />
      <GameBoard />
    </div>
  );
}
