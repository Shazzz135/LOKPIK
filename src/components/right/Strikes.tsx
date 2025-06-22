interface StrikesProps {
  difficulty: number;
  strikes: number;
}

const Strikes = ({ difficulty, strikes }: StrikesProps) => {
  const strikeColors = [
    "text-blue-300",
    "text-orange-300", 
    "text-red-300"
  ][difficulty];

  return (
    <div className="absolute top-8 left-8 px-6 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur">
      <div className="text-center">
        <div className="text-sm text-white/70 font-semibold">STRIKES</div>
        <div className="flex space-x-2 justify-center">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`text-2xl font-bold drop-shadow-lg ${
                index < strikes ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              ✗
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Strikes;