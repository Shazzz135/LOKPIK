import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface ResultsState {
  difficulty: number;
  score: number;
  isWin: boolean; // true if time ran out, false if struck out
  timeRemaining?: number;
  saveHighScore?: boolean; // Add flag to control high score saving
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState;
    // Fallback if no state is provided
  const difficulty = state?.difficulty ?? (() => {
    const saved = localStorage.getItem('lockpick-difficulty');
    return saved ? parseInt(saved) : 0;
  })();
  const score = state?.score ?? 0;
  const isWin = state?.isWin ?? false;

  // Save high score when component mounts
  useEffect(() => {
    const savedScores = localStorage.getItem('lockpick-highscores');
    const highScores = savedScores ? JSON.parse(savedScores) : [0, 0, 0];
    
    if (score > highScores[difficulty]) {
      highScores[difficulty] = score;
      localStorage.setItem('lockpick-highscores', JSON.stringify(highScores));
    }
  }, [difficulty, score]);

  // Get current high score for display
  const getCurrentHighScore = () => {
    const savedScores = localStorage.getItem('lockpick-highscores');
    const highScores = savedScores ? JSON.parse(savedScores) : [0, 0, 0];
    return highScores[difficulty];
  };

  const currentHighScore = getCurrentHighScore();
  const isNewHighScore = score > 0 && score === currentHighScore;  const gradients = [
    "bg-gradient-to-b from-blue-950 to-blue-900",
    "bg-gradient-to-b from-orange-900 to-yellow-700",
    "bg-gradient-to-b from-rose-950 to-red-800"
  ];

  const difficultyNames = ["Easy", "Medium", "Hard"];
  const buttonBorders = [
    "border-blue-300",
    "border-orange-300",
    "border-red-300"
  ];
  const buttonGradients = [
    "bg-gradient-to-br from-blue-950 via-blue-950 to-blue-900",
    "bg-gradient-to-br from-orange-950 via-orange-900 to-orange-800",
    "bg-gradient-to-br from-rose-950 via-red-950 to-red-900",
  ];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  return (
    <div className={`flex flex-col items-center justify-center h-screen w-screen ${gradients[difficulty]} text-white relative`}>
      {/* High Score Display */}
      <div className="absolute top-8 right-8 px-6 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur">
        <div className="text-center">
          <div className="text-sm text-white/70 font-semibold">HIGH SCORE</div>
          <div className="text-2xl font-mono font-bold text-yellow-300 drop-shadow-lg">
            {currentHighScore}
          </div>
        </div>
      </div>
      
      <div className="text-center max-w-2xl px-8">
        {isWin ? (
          <>
            <h1 className="text-6xl font-black mb-6 text-green-400 drop-shadow-lg">
              🎉 Done! 🎉
            </h1>
            <h2 className="text-3xl font-bold mb-4">
              At least you didn't strike out!
            </h2>            <p className="text-xl mb-6 text-white/90">
              You managed to crack <span className="font-bold text-yellow-300">{score}</span> combination(s) 
              on <span className="font-bold">{difficultyNames[difficulty]}</span> mode
              before running out of time!
            </p>            {score >= 1 && (
              <p className="text-lg text-green-300 mb-8">
                Your lock-picking skills are impressive! 🔓
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="text-6xl font-black mb-6 text-red-400 drop-shadow-lg">
              💥 BUSTED! 💥
            </h1>
            <h2 className="text-3xl font-bold mb-4">
              You struck out!
            </h2>
            <p className="text-xl mb-6 text-white/90">
              You cracked <span className="font-bold text-yellow-300">{score}</span> combination(s) on <span className="font-bold">{difficultyNames[difficulty]}</span> mode 
              before striking out.
            </p>            <p className="text-lg text-red-300 mb-8">
              Better luck next time! 🔒
            </p>
          </>
        )}
          <div className="flex gap-6 justify-center">          <button
            className={`px-8 py-4 text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 ${buttonGradients[difficulty]} border-4 ${buttonBorders[difficulty]} text-white`}
            onClick={() => navigate('/game', { state: { difficulty } })}
          >
            Play Again
          </button>
          <button
            className={`px-8 py-4 text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-all duration-200 ${buttonGradients[difficulty]} border-4 ${buttonBorders[difficulty]} text-white`}
            onClick={() => navigate('/home')}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;