interface SubmitButtonProps {
  difficulty: number;
  onSubmit: () => void;
  isDisabled?: boolean;
  cooldownTime?: number;
  showGood?: boolean;
}

const SubmitButton = ({ difficulty, onSubmit, isDisabled = false, cooldownTime = 0, showGood = false }: SubmitButtonProps) => {
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
    <button
      className={`mt-6 px-8 py-4 text-2xl font-bold rounded-xl shadow-lg transition-all duration-200 ${boxGradients[difficulty]} border-4 ${borderColors[difficulty]} text-white ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
      }`}
      onClick={onSubmit}
      disabled={isDisabled}
    >
      {showGood ? 'Good!' : isDisabled && cooldownTime > 0 ? `Whoops ${cooldownTime}s` : 'Submit'}
    </button>
  );
};

export default SubmitButton;