import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LockBox from "../components/right/LockBox";
import SubmitButton from "../components/right/SubmitButton";
import Timer from "../components/right/Timer";
import GameStartPopup from "../components/GameStartPopup";
import Score from "../components/right/Score";
import Strikes from "../components/right/Strikes";
import HintBoxes from "../components/left/HintBoxes";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get difficulty from navigation state or localStorage
  const difficulty = location.state?.difficulty ?? (() => {
    const saved = localStorage.getItem('lockpick-difficulty');
    return saved ? parseInt(saved) : 0;
  })();
  
  const gradients = [
    "bg-gradient-to-b from-blue-950 to-blue-900", // Easy (darker)
    "bg-gradient-to-b from-orange-900 to-yellow-700", // Medium (darker)
    "bg-gradient-to-b from-rose-950 to-red-800" // Hard (darker)
  ];

  const [numbers, setNumbers] = useState([0, 0, 0]);
  const [targetNumber, setTargetNumber] = useState(() => 
    Math.floor(Math.random() * 900) + 100 // Generate 3-digit number
  );
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashColor, setFlashColor] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  
  const backButtonBorder = [
    "border-blue-300",
    "border-orange-300",
    "border-red-300",
  ][difficulty];
  
  const backButtonGradient = [
    "bg-gradient-to-br from-blue-950 via-blue-950 to-blue-900",
    "bg-gradient-to-br from-orange-950 via-orange-900 to-orange-800",
    "bg-gradient-to-br from-rose-950 via-red-950 to-red-900",
  ][difficulty];

  const handleRestart = () => {
    // Reset all game state including timer
    setScore(0);
    setStrikes(0);
    setNumbers([0, 0, 0]);
    setTargetNumber(Math.floor(Math.random() * 900) + 100);
    setIsFlashing(false);
    setFlashColor('');
    setIsSubmitDisabled(false);
    setSubmitCooldown(0);
    setShowPopup(true);
    
    // Clear timer from localStorage to reset it
    localStorage.removeItem('lockpick-game-start');
  };

  const changeNumber = (idx: number, delta: number) => {
    setNumbers(nums => {
      const newNums = [...nums];
      newNums[idx] = (newNums[idx] + delta + 10) % 10;
      return newNums;
    });
  };

  const arrowColors = [
    "text-blue-300 hover:text-blue-100",
    "text-orange-300 hover:text-orange-100", 
    "text-red-300 hover:text-red-100"
  ][difficulty];
  const handleSubmit = () => {
    if (isSubmitDisabled) return; // Prevent submission during cooldown
    
    const enteredNumber = parseInt(numbers.join(''));
    if (enteredNumber === targetNumber) {
      // Correct! Flash green and increment score
      setScore(score + 1);
      setFlashColor('bg-green-500/80');
      setIsFlashing(true);
      setTimeout(() => {
        setTargetNumber(Math.floor(Math.random() * 900) + 100);
        setNumbers([0, 0, 0]); // Reset to 000
        setIsFlashing(false);
        setFlashColor('');
      }, 800);
    } else {
      // Wrong! Add strike and flash red, then disable submit for 3 seconds
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      
      if (newStrikes >= 3) {
        // Game Over - navigate to results
        navigate('/results', { 
          state: { 
            difficulty, 
            score, 
            isWin: false 
          } 
        });
      } else {
        setFlashColor('bg-red-500/80');
        setIsFlashing(true);
        setIsSubmitDisabled(true);
        setSubmitCooldown(3);
        
        // Start cooldown countdown
        const cooldownInterval = setInterval(() => {
          setSubmitCooldown(prev => {
            if (prev <= 1) {
              clearInterval(cooldownInterval);
              setIsSubmitDisabled(false);
              setIsFlashing(false);
              setFlashColor('');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };
  return (
    <div className={`flex items-stretch justify-stretch min-h-screen min-w-screen h-screen w-screen ${gradients[difficulty]} relative p-0 m-0 overflow-visible`}>
      {showPopup && (
        <GameStartPopup
          difficulty={difficulty}
          onClose={() => setShowPopup(false)}
        />
      )}
      
      {/* Left side */}
      <div className="flex-1 flex items-center justify-center overflow-visible p-0 m-0 relative">
        <button
          className={`absolute top-8 left-8 px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-all duration-200 ${backButtonGradient} border-4 ${backButtonBorder} font-bold text-lg text-white`}
          onClick={() => navigate('/home')}
        >
          ← Back
        </button>
        <HintBoxes difficulty={difficulty} />
      </div>
      
      {/* Vertical fading line */}
      <div className="w-0.5 h-full bg-gradient-to-b from-transparent via-white/60 to-transparent pointer-events-none" />
      
      {/* Right side */}
      <div className="flex-1 flex items-center justify-center overflow-visible p-0 m-0 relative">        <Timer difficulty={difficulty} startTimer={!showPopup} score={score} />
        <Score difficulty={difficulty} score={score} />
        <Strikes difficulty={difficulty} strikes={strikes} />
        
        <div className="flex flex-col items-center">
          <LockBox 
            difficulty={difficulty}
            numbers={numbers}
            setNumbers={setNumbers}
            isFlashing={isFlashing}
            flashColor={flashColor}
          />
          <SubmitButton
            difficulty={difficulty}
            targetNumber={targetNumber}
            onSubmit={handleSubmit}
            isDisabled={isSubmitDisabled}
            cooldownTime={submitCooldown}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;