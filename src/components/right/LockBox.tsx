interface LockBoxProps {
  difficulty: number;
  numbers: number[];
  setNumbers: (numbers: number[]) => void;
  isFlashing: boolean;
  digitFeedback: ('correct' | 'incorrect' | 'none')[];
}

const LockBox = ({ difficulty, numbers, setNumbers, isFlashing, digitFeedback }: LockBoxProps) => {
  const boxGradients = [
    "bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-blue-700/60",
    "bg-gradient-to-br from-orange-900/90 via-orange-800/80 to-yellow-700/60",
    "bg-gradient-to-br from-rose-950/90 via-red-900/80 to-red-700/60"
  ];

  const arrowColors = [
    "text-blue-300 hover:text-blue-100",
    "text-orange-300 hover:text-orange-100", 
    "text-red-300 hover:text-red-100"
  ][difficulty];

  const changeNumber = (idx: number, delta: number) => {
    const newNums = [...numbers];
    newNums[idx] = (newNums[idx] + delta + 10) % 10;
    setNumbers(newNums);
  };

  // Adjust height based on number of digits (rotated 90 degrees)
  const boxHeight = numbers.length <= 3 ? 'h-80' : numbers.length === 4 ? 'h-96' : 'h-[28rem]';
  const spacing = numbers.length <= 3 ? 'my-4' : numbers.length === 4 ? 'my-3' : 'my-2';
  const fontSize = numbers.length <= 3 ? 'text-6xl' : numbers.length === 4 ? 'text-5xl' : 'text-4xl';

  // Scale based on difficulty
  const scaleClass = difficulty === 0 ? 'scale-100' : difficulty === 1 ? 'scale-90' : 'scale-85';

  return (
    <div className={`w-72 ${boxHeight} rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/20 backdrop-blur-md overflow-hidden ${boxGradients[difficulty]} relative transform ${scaleClass} origin-center`}>
      <div className="flex flex-col w-full h-full items-center justify-center relative z-20">
        {numbers.map((num, idx) => (
          <div key={idx} className={`flex items-center ${spacing}`}>
            <button
              className={`text-4xl ${arrowColors} mr-4 transition-all duration-200 hover:scale-110 font-bold drop-shadow-lg`}
              onClick={() => changeNumber(idx, -1)}
            >
              ◀
            </button>
            <div className="text-center relative">
              {/* Flash overlay for individual number */}
              {isFlashing && digitFeedback[idx] !== 'none' && (
                <div className={`absolute inset-0 rounded-lg z-10 pointer-events-none ${
                  digitFeedback[idx] === 'correct' ? 'bg-green-500/60' : 'bg-red-500/60'
                }`} />
              )}
              <div className="text-5xl font-mono font-black text-white/90 transform scale-90 border-2 border-white/30 rounded-lg px-4 py-2 relative z-20 overflow-hidden">
                {numbers[idx]}
              </div>
            </div>
            <button
              className={`text-4xl ${arrowColors} ml-4 transition-all duration-200 hover:scale-110 font-bold drop-shadow-lg`}
              onClick={() => changeNumber(idx, 1)}
            >
              ▶
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LockBox;