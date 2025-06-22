import { useState, useEffect } from "react";

interface GameStartPopupProps {
  difficulty: number;
  onClose: () => void;
}

const GameStartPopup = ({ difficulty, onClose }: GameStartPopupProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const popupGradients = [
    "bg-gradient-to-br from-blue-900/95 via-blue-700/90 to-blue-500/85",
    "bg-gradient-to-br from-orange-900/95 via-orange-700/90 to-yellow-500/85",
    "bg-gradient-to-br from-rose-900/95 via-red-700/90 to-red-500/85"
  ];

  const difficultyNames = ["Easy", "Medium", "Hard"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
        <div className={`${popupGradients[difficulty]} rounded-2xl p-8 shadow-2xl border-4 border-white/30 text-center transform scale-95 transition-all duration-300`}>
          <h2 className="text-4xl font-bold text-white mb-4">Get Ready!</h2>
          <p className="text-xl text-white/90 mb-2">Difficulty: {difficultyNames[difficulty]}</p>
          <p className="text-lg text-white/80">Crack the Code before time runs out!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300">
      <div className={`${popupGradients[difficulty]} rounded-2xl p-8 shadow-2xl border-4 border-white/30 text-center transform scale-100 transition-all duration-300`}>
        <h2 className="text-4xl font-bold text-white mb-4">Get Ready!</h2>
        <p className="text-xl text-white/90 mb-2">Difficulty: {difficultyNames[difficulty]}</p>
        <p className="text-lg text-white/80">Crack the Code before time runs out!</p>
      </div>
    </div>
  );
};

export default GameStartPopup;