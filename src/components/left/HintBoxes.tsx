import { useState, useEffect } from "react";

interface HintBoxesProps {
  difficulty: number;
  digitCount: number;
  targetNumber: number;
}

interface TriviaFact {
  position: number;
  hidden_digit: string;
  fact: string;
}

const HintBoxes = ({ difficulty, digitCount, targetNumber }: HintBoxesProps) => {
  const [triviaFacts, setTriviaFacts] = useState<TriviaFact[]>([]);
  const [loading, setLoading] = useState(false);

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

  const fetchTriviaFacts = async () => {
    if (!targetNumber) return;
    
    setLoading(true);
    try {
      // Convert target number to array of digits
      const targetDigits = targetNumber.toString().split('').map(Number);
      const facts: TriviaFact[] = [];
      
      // Fetch trivia for each digit of the target number
      for (let i = 0; i < targetDigits.length; i++) {
        const digit = targetDigits[i];
        try {
          const response = await fetch(`http://numbersapi.com/${digit}/trivia`);
          if (response.ok) {
            const factText = await response.text();
            // Hide the digit in the fact text
            const hiddenFact = factText.replace(new RegExp(digit.toString(), 'g'), '_');
            facts.push({
              position: i + 1,
              hidden_digit: "_",
              fact: hiddenFact.trim()
            });
          } else {
            facts.push({
              position: i + 1,
              hidden_digit: "_",
              fact: "No trivia available for this digit"
            });
          }
        } catch (error) {
          facts.push({
            position: i + 1,
            hidden_digit: "_",
            fact: "Unable to fetch trivia for this digit"
          });
        }
      }
      
      setTriviaFacts(facts);
    } catch (error) {
      console.error('Failed to fetch trivia:', error);
      setTriviaFacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTriviaFacts();
  }, [targetNumber]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-lg px-4">
      {Array.from({ length: digitCount }, (_, index) => {
        const fact = triviaFacts[index];
        return (
          <div
            key={index + 1}
            className={`w-full h-20 rounded-xl ${boxGradients[difficulty]} border-4 ${borderColors[difficulty]} shadow-lg flex items-center justify-center min-w-[360px]`}
          >
            <div className="text-center px-4">
              <div className="text-xs text-white/70 font-semibold mb-1">
                HINT {index + 1} - DIGIT _
              </div>
              <div className="text-white/90 text-xs leading-tight">
                {loading ? "Loading trivia..." : (fact?.fact || `Waiting for hint ${index + 1}...`)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HintBoxes;