interface LoadingProps {
  difficulty?: number;
}

const Loading = ({ difficulty }: LoadingProps) => {
  // Get difficulty from localStorage if not provided via props
  const currentDifficulty = difficulty ?? (() => {
    const saved = localStorage.getItem('lockpick-difficulty');
    return saved ? parseInt(saved) : 0;
  })();  const gradients = [
    "bg-gradient-to-b from-blue-950 to-blue-900",
    "bg-gradient-to-b from-orange-900 to-yellow-700", 
    "bg-gradient-to-b from-rose-950 to-red-800"
  ];

  const textColors = [
    "text-blue-300",
    "text-orange-300",
    "text-red-300"
  ];

  return (
    <div className={`flex flex-col items-center justify-center h-screen w-screen ${gradients[currentDifficulty]} transition-colors duration-700`}>
      <div className="text-center">        <h1 className={`text-8xl font-black mb-8 ${textColors[currentDifficulty]} drop-shadow-lg transition-colors duration-700`}>
          LOKPIK
        </h1><div className="flex items-center justify-center space-x-2">
          <div className={`w-4 h-4 ${textColors[currentDifficulty]} rounded-full animate-bounce`}></div>
          <div className={`w-4 h-4 ${textColors[currentDifficulty]} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
          <div className={`w-4 h-4 ${textColors[currentDifficulty]} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className={`text-xl mt-8 ${textColors[currentDifficulty]} opacity-80 transition-colors duration-700`}>
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;