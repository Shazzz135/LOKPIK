interface HintBoxesProps {
  difficulty: number;
  digitCount: number;
}

const HintBoxes = ({ difficulty, digitCount }: HintBoxesProps) => {
  const boxGradients = [
    "bg-gradient-to-br from-blue-950 via-blue-950 to-blue-900",
    "bg-gradient-to-br from-orange-950 via-orange-900 to-orange-800",
    "bg-gradient-to-br from-rose-950 via-red-950 to-red-900"
  ];

  const borderColors = [
    "border-blue-300",
    "border-orange-300",
    "border-red-300"
  ];

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-lg px-4">
      {Array.from({ length: digitCount }, (_, index) => (
        <div
          key={index + 1}
          className={`w-full h-20 rounded-xl ${boxGradients[difficulty]} border-4 ${borderColors[difficulty]} shadow-lg flex items-center justify-center min-w-[360px]`}
        >
          <div className="text-center">
            <div className="text-xs text-white/70 font-semibold mb-1">
              HINT {index + 1}
            </div>
            <div className="text-white/50 text-sm">
              Coming Soon...
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HintBoxes;