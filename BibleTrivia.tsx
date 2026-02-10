
import React, { useState } from 'react';
import { QuizQuestion } from './types';

const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    question: "Who was the first king of Israel?",
    options: ["David", "Saul", "Solomon", "Samuel"],
    correctAnswer: 1,
    explanation: "Saul was anointed as the first king of Israel by the prophet Samuel."
  },
  {
    question: "How many books are in the New Testament?",
    options: ["27", "39", "66", "12"],
    correctAnswer: 0,
    explanation: "There are 27 books in the New Testament, starting with Matthew."
  }
];

const BibleTrivia: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === MOCK_QUESTIONS[currentIdx].correctAnswer) {
      setScore(score + 100);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < MOCK_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="glass p-8 text-center space-y-6">
        <h2 className="text-3xl serif font-bold">Well Done!</h2>
        <div className="text-5xl font-bold text-yellow-400">{score}</div>
        <p className="text-white/60">Points Earned Today</p>
        <button 
          onClick={() => {setCurrentIdx(0); setScore(0); setShowResult(false); setSelected(null);}}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90"
        >
          Play Again
        </button>
      </div>
    );
  }

  const q = MOCK_QUESTIONS[currentIdx];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Question {currentIdx + 1}/{MOCK_QUESTIONS.length}</span>
        <span className="text-xs font-bold text-yellow-400">Score: {score}</span>
      </div>

      <div className="glass p-8 shadow-2xl relative">
        <h3 className="text-xl serif font-bold mb-8 leading-relaxed">{q.question}</h3>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full p-4 rounded-xl text-left text-sm font-medium border transition-all ${
                selected === null 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : i === q.correctAnswer 
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : selected === i 
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-white/5 border-white/10 opacity-40'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {selected !== null && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-2">
            <p className="text-xs text-white/60 mb-6 italic">{q.explanation}</p>
            <button 
              onClick={nextQuestion}
              className="w-full py-4 bg-white/10 border border-white/20 rounded-xl font-bold text-sm hover:bg-white/20"
            >
              {currentIdx < MOCK_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleTrivia;
