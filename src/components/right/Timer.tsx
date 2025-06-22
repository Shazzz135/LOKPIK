import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface TimerProps {
  difficulty: number;
  startTimer: boolean;
  score: number;
}

const Timer = ({ difficulty, startTimer, score }: TimerProps) => {
  const navigate = useNavigate();
  
  // Initialize timer start time only when timer actually starts
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(5 * 60 * 1000); // Always start at 5 minutes

  const timerColors = [
    "text-blue-300",
    "text-orange-300", 
    "text-red-300"
  ][difficulty];

  // Set start time when timer begins
  useEffect(() => {
    if (startTimer && gameStartTime === null) {
      const startTime = Date.now();
      setGameStartTime(startTime);
      localStorage.setItem('lockpick-game-start', startTime.toString());
    }
  }, [startTimer, gameStartTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Time's up! Reset timer and navigate to results
      localStorage.removeItem('lockpick-game-start');
      navigate('/results', {
        state: {
          difficulty,
          score,
          isWin: true,
          timeRemaining: 0
        }
      });
      return;
    }

    if (!startTimer || gameStartTime === null) return;

    const timer = setInterval(() => {
      const totalGameTime = 5 * 60 * 1000; // 5 minutes
      const elapsed = Date.now() - gameStartTime;
      const remaining = Math.max(0, totalGameTime - elapsed);
      setTimeLeft(remaining);
    }, 10); // Update every 10ms

    return () => clearInterval(timer);
  }, [timeLeft, startTimer, navigate, difficulty, score, gameStartTime]);

  // Reset timer when component unmounts (going back to home)
  useEffect(() => {
    return () => {
      localStorage.removeItem('lockpick-game-start');
    };
  }, []);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10); // Get 2-digit milliseconds
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };
  return (
    <div className="absolute top-8 right-8 px-6 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur">
      <div className="text-center">
        <div className="text-sm text-white/70 font-semibold">TIME</div>
        <div className={`text-2xl font-mono font-bold ${timerColors} drop-shadow-lg`}>
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default Timer;