interface ScoreProps {
  difficulty: number;
  score: number;
}

const Score = ({ difficulty, score }: ScoreProps) => {
  const scoreColors = [
    "text-blue-300",
    "text-orange-300", 
    "text-red-300"
  ][difficulty];

  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur">
      <div className="text-center">
        <div className="text-sm text-white/70 font-semibold">SCORE</div>
        <div className={`text-2xl font-mono font-bold ${scoreColors} drop-shadow-lg`}>
          {score}
        </div>
      </div>
    </div>
  );
};

export default Score;