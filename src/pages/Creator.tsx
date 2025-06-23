import { useState, useEffect } from "react";

const Creator = ({ difficulty }: { difficulty?: number }) => {
  // State to track current difficulty for theme changes
  const [currentDifficulty, setCurrentDifficulty] = useState(() => {
    const saved = localStorage.getItem('lockpick-difficulty');
    return difficulty ?? (saved ? parseInt(saved) : 0);
  });

  // Listen for localStorage changes to update theme
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('lockpick-difficulty');
      const newDifficulty = saved ? parseInt(saved) : 0;
      setCurrentDifficulty(newDifficulty);
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for changes (in case of same-tab updates)
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Update when difficulty prop changes
  useEffect(() => {
    if (difficulty !== undefined) {
      setCurrentDifficulty(difficulty);
    }
  }, [difficulty]);

  const nameColor = [
    "text-blue-300 hover:text-purple-400",
    "text-orange-300 hover:text-purple-400",
    "text-red-300 hover:text-purple-400",
  ][currentDifficulty];  const bgColor = [
    "bg-blue-950/90",
    "bg-orange-900/90",
    "bg-rose-950/90",
  ][currentDifficulty];

  const borderColor = [
    "border-blue-300",
    "border-orange-300",
    "border-red-300",
  ][currentDifficulty];
  return (
    <div
      className={`${bgColor} rounded-xl px-6 py-3 shadow-lg border-4 ${borderColor} text-white text-lg font-semibold flex flex-col items-start text-left transition-colors duration-700 max-[400px]:px-3 max-[400px]:py-2 max-[400px]:text-sm max-[400px]:border-2 transform scale-65 origin-bottom-left`}
    >
      <span>
        Creator:{" "}
        <a
          href="https://github.com/Shazzz135"
          target="_blank"
          rel="noopener noreferrer"
          className={`${nameColor} underline transition-colors duration-300`}
        >
          Shazzz
        </a>
      </span>
      <span className="text-xs text-white/70 mt-1 text-left">
        Front: Vite + React + Tailwind <br />
        Back: Python using 'NumberTriviaAPI'
      </span>
    </div>
  );
};

export default Creator;