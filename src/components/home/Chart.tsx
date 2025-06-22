import { useState, useEffect } from "react";

interface ChartProps {
  difficulty: number;
}

const Chart = ({ difficulty }: ChartProps) => {
  const [highScores, setHighScores] = useState<number[]>([0, 0, 0]);

  const difficultyNames = ["Easy", "Medium", "Hard"];
  const difficultyColors = [
    "text-blue-300",
    "text-orange-300", 
    "text-red-300"
  ];

  // Load high scores from localStorage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem('lockpick-highscores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  // Update high score for current difficulty
  const updateHighScore = (difficultyLevel: number, newScore: number) => {
    const updatedScores = [...highScores];
    if (newScore > updatedScores[difficultyLevel]) {
      updatedScores[difficultyLevel] = newScore;
      setHighScores(updatedScores);
      localStorage.setItem('lockpick-highscores', JSON.stringify(updatedScores));
    }
  };

  // Expose updateHighScore function globally so Game can call it
  useEffect(() => {
    (window as any).updateHighScore = updateHighScore;
  }, [highScores]);

  return (
    <div className="absolute top-8 right-8 px-6 py-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur">
      <div className="text-center">
        <div className="text-sm text-white/70 font-semibold mb-3">HIGH SCORES</div>
        <div className="space-y-2">
          {difficultyNames.map((name, idx) => (
            <div key={idx} className="flex justify-between items-center min-w-[120px]">
              <span className={`text-sm font-medium ${difficultyColors[idx]} ${
                idx === difficulty ? 'font-bold' : ''
              }`}>
                {name}:
              </span>
              <span className={`text-lg font-mono font-bold ${difficultyColors[idx]} ${
                idx === difficulty ? 'text-white' : ''
              }`}>
                {highScores[idx]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chart;