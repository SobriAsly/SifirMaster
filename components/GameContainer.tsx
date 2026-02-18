
import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Question, Difficulty, ChoiceState } from '../types';
import { audioService } from '../services/audio';

interface GameContainerProps {
  mode: GameMode;
  questions: Question[];
  onFinish: (score: number) => void;
  onQuit: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ mode, questions, onFinish, onQuit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState<ChoiceState[]>([]);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const currentQuestion = questions[currentIndex];

  const initializeChoices = useCallback(() => {
    if (!currentQuestion) return;
    setChoices(currentQuestion.options.map(val => ({ value: val, status: 'idle' })));
    setAnswered(false);
    setFeedback(null);
  }, [currentQuestion]);

  useEffect(() => {
    initializeChoices();
  }, [initializeChoices]);

  const handleSelect = (selected: number) => {
    if (answered) return;

    const isCorrect = selected === currentQuestion.answer;
    setAnswered(true);

    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
      audioService.playSuccess();
      setChoices(prev => prev.map(c => 
        c.value === selected ? { ...c, status: 'correct' } : c
      ));
    } else {
      setFeedback('incorrect');
      audioService.playError();
      setChoices(prev => prev.map(c => {
        if (c.value === selected) return { ...c, status: 'incorrect' };
        if (c.value === currentQuestion.answer) return { ...c, status: 'missed' };
        return c;
      }));
    }

    // Auto next after 1.5 seconds
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        onFinish(score + (isCorrect ? 1 : 0));
      }
    }, 1200);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto p-6 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={onQuit} className="text-gray-400 hover:text-red-500 transition-colors">
          <i className="fas fa-times-circle text-2xl"></i>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Question</span>
          <span className="text-2xl font-black text-blue-600">{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Score</span>
          <span className="text-2xl font-black text-green-500">{score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-12 overflow-hidden shadow-inner">
        <div 
          className="h-full bg-blue-500 transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Question Display */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-white w-full py-12 px-4 rounded-[40px] shadow-2xl border-4 border-blue-50 relative overflow-hidden">
          {/* Animated Background Pulse for Feedback */}
          {feedback === 'correct' && <div className="absolute inset-0 bg-green-50 animate-pulse" />}
          {feedback === 'incorrect' && <div className="absolute inset-0 bg-red-50 animate-shake" />}
          
          <div className="relative z-10 flex flex-col gap-2">
            <h3 className="text-8xl font-black text-gray-800 tracking-tighter">
              {currentQuestion.m} <span className="text-blue-400">×</span> {currentQuestion.n}
            </h3>
            <div className="text-gray-300 text-5xl font-black">= ?</div>
          </div>
        </div>
      </div>

      {/* Choices Grid */}
      <div className="mt-12 grid grid-cols-2 gap-4">
        {choices.map((choice, idx) => (
          <button
            key={`${currentIndex}-${idx}`}
            onClick={() => handleSelect(choice.value)}
            disabled={answered}
            className={`
              relative py-8 rounded-[2rem] text-4xl font-black transition-all transform
              active:scale-95 flex items-center justify-center overflow-hidden
              ${choice.status === 'idle' ? 'bg-white shadow-lg text-gray-700 hover:shadow-xl hover:-translate-y-1' : ''}
              ${choice.status === 'correct' ? 'bg-green-500 text-white shadow-green-200 animate-pulse scale-105' : ''}
              ${choice.status === 'incorrect' ? 'bg-red-500 text-white shadow-red-200 animate-shake' : ''}
              ${choice.status === 'missed' ? 'bg-green-100 text-green-600 border-4 border-dashed border-green-500' : ''}
            `}
          >
            {choice.value}
            {choice.status === 'correct' && (
               <i className="fas fa-check-circle absolute top-4 right-4 text-xl text-white/50"></i>
            )}
            {choice.status === 'incorrect' && (
               <i className="fas fa-times-circle absolute top-4 right-4 text-xl text-white/50"></i>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameContainer;
