import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LockBox from "../components/right/LockBox";
import SubmitButton from "../components/right/SubmitButton";
import Timer from "../components/right/Timer";
import GameStartPopup from "../components/GameStartPopup";
import Score from "../components/right/Score";
import Strikes from "../components/right/Strikes";
import HintBoxes from "../components/left/HintBoxes";

// Sound effects - correct import paths
import unlockSound from "../../sounds/unlock_noise.wav";
import wrongSound from "../../sounds/wrong_noise.wav";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const difficulty = location.state?.difficulty ?? (() => {
    const saved = localStorage.getItem('lockpick-difficulty');
    return saved ? parseInt(saved) : 0;
  })();
  
  const getDigitCount = (difficulty: number) => {
    return difficulty + 3; // Easy: 3, Medium: 4, Hard: 5
  };

  const getTargetRange = (difficulty: number) => {
    const digitCount = getDigitCount(difficulty);
    const min = Math.pow(10, digitCount - 1);
    const max = Math.pow(10, digitCount) - 1;
    return { min, max };
  };

  const digitCount = getDigitCount(difficulty);
  const { min, max } = getTargetRange(difficulty);
  
  const gradients = [
    "bg-gradient-to-b from-blue-950 to-blue-900", // Easy
    "bg-gradient-to-b from-orange-900 to-yellow-700", // Medium
    "bg-gradient-to-b from-rose-950 to-red-800" // Hard
  ];

  const [numbers, setNumbers] = useState(() => new Array(digitCount).fill(0));
  const [targetNumber, setTargetNumber] = useState(() => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashColor, setFlashColor] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const [wasLastAnswerCorrect, setWasLastAnswerCorrect] = useState(false);
  
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

  const playCorrectSound = () => {
    console.log('Attempting to play correct sound:', unlockSound);
    try {
      const audio = new Audio(unlockSound);
      audio.volume = 0.7;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log('Correct sound played successfully'))
          .catch(e => console.log('Could not play correct sound:', e));
      }
    } catch (error) {
      console.log('Error creating correct audio:', error);
    }
  };

  const playWrongSound = () => {
    console.log('Attempting to play wrong sound:', wrongSound);
    try {
      const audio = new Audio(wrongSound);
      audio.volume = 0.7;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log('Wrong sound played successfully'))
          .catch(e => console.log('Could not play wrong sound:', e));
      }
    } catch (error) {
      console.log('Error creating wrong audio:', error);
    }
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) return;
    
    const enteredNumber = parseInt(numbers.join(''));
    setIsSubmitDisabled(true);
    setSubmitCooldown(3);
    
    if (enteredNumber === targetNumber) {
      setWasLastAnswerCorrect(true);
      playCorrectSound();
      setScore(score + 1);
      setFlashColor('bg-green-500/80');
      setIsFlashing(true);
      
      // Reset after flash effect but before cooldown ends
      setTimeout(() => {
        const { min, max } = getTargetRange(difficulty);
        setTargetNumber(Math.floor(Math.random() * (max - min + 1)) + min);
        setNumbers(new Array(digitCount).fill(0));
        setIsFlashing(false);
        setFlashColor('');
      }, 800);
    } else {
      setWasLastAnswerCorrect(false);
      playWrongSound();
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      
      if (newStrikes >= 3) {
        navigate('/results', { 
          state: { 
            difficulty, 
            score, 
            isWin: false 
          } 
        });
        return;
      } else {
        setFlashColor('bg-red-500/80');
        setIsFlashing(true);
        
        // Clear flash effect after 800ms but keep cooldown
        setTimeout(() => {
          setIsFlashing(false);
          setFlashColor('');
        }, 800);
      }
    }
    
    // Always apply 3-second cooldown
    const cooldownInterval = setInterval(() => {
      setSubmitCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownInterval);
          setIsSubmitDisabled(false);
          setWasLastAnswerCorrect(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
        <HintBoxes difficulty={difficulty} digitCount={digitCount} />
      </div>
      
      {/* Vertical fading line */}
      <div className="w-0.5 h-full bg-gradient-to-b from-transparent via-white/60 to-transparent pointer-events-none" />
      
      {/* Right side */}
      <div className="flex-1 flex items-center justify-center overflow-visible p-0 m-0 relative">
        <Timer difficulty={difficulty} startTimer={!showPopup} score={score} />
        <Score difficulty={difficulty} score={score} />
        <Strikes difficulty={difficulty} strikes={strikes} />
        
        <div className="flex flex-col items-center mt-16">
          <LockBox 
            difficulty={difficulty}
            numbers={numbers}
            setNumbers={setNumbers}
            isFlashing={isFlashing}
            flashColor={flashColor}
          />
          <div className="mt-6">
            <SubmitButton
              difficulty={difficulty}
              targetNumber={targetNumber}
              onSubmit={handleSubmit}
              isDisabled={isSubmitDisabled}
              cooldownTime={submitCooldown}
              showGood={wasLastAnswerCorrect && isSubmitDisabled && submitCooldown > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;