interface StrikesProps {
  difficulty: number;
  strikes: number;
}

const Strikes = ({ difficulty, strikes }: StrikesProps) => {
  return (
    <div className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur w-40">
      <div className="text-center">
        <div className="text-sm text-white/70 font-semibold">STRIKES</div>
        <div className="text-2xl font-mono font-bold drop-shadow-lg flex justify-center space-x-6">
          {Array.from({ length: 3 }, (_, i) => (
            <span
              key={i}
              className={i < strikes ? 'text-red-500' : 'text-gray-400'}
            >
              X
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Strikes;