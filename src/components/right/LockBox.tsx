interface LockBoxProps {
  difficulty: number;
  numbers: number[];
  setNumbers: (numbers: number[]) => void;
  isFlashing: boolean;
  flashColor: string;
}

const LockBox = ({ difficulty, numbers, setNumbers, isFlashing, flashColor }: LockBoxProps) => {
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

  // Adjust width based on number of digits
  const boxWidth = numbers.length <= 3 ? 'w-80' : numbers.length === 4 ? 'w-96' : 'w-[28rem]';
  const spacing = numbers.length <= 3 ? 'mx-4' : numbers.length === 4 ? 'mx-3' : 'mx-2';
  const fontSize = numbers.length <= 3 ? 'text-6xl' : numbers.length === 4 ? 'text-5xl' : 'text-4xl';

  return (
    <div className={`${boxWidth} h-72 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/20 backdrop-blur-md overflow-hidden ${boxGradients[difficulty]}`}>
      <div className="flex w-full h-full items-center justify-center">
        {numbers.map((num, idx) => (
          <div key={idx} className={`flex flex-col items-center ${spacing}`}>
            <button
              className={`text-4xl ${arrowColors} mb-4 transition-all duration-200 hover:scale-110 font-bold drop-shadow-lg`}
              onClick={() => changeNumber(idx, 1)}
            >
              ▲
            </button>
            <span className={`${fontSize} font-mono text-white drop-shadow-lg select-none px-4 py-2 rounded-lg border border-white/20 mb-3 transition-all duration-300 ${
              isFlashing ? flashColor : 'bg-white/10'
            }`}>
              {num}
            </span>
            <button
              className={`text-4xl ${arrowColors} mt-4 transition-all duration-200 hover:scale-110 font-bold drop-shadow-lg`}
              onClick={() => changeNumber(idx, -1)}
            >
              ▼
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LockBox;