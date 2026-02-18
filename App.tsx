
import React, { useState, useEffect } from 'react';
import { GameMode, Difficulty, GameState, Question, HallOfFameEntry } from './types';
import Menu from './components/Menu';
import GameContainer from './components/GameContainer';
import Result from './components/Result';
import HallOfFame from './components/HallOfFame';

const STORAGE_KEY = 'sifir_master_hall_of_fame';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    mode: GameMode.MENU,
    difficulty: Difficulty.EASY,
    selectedSifir: null,
    selectedRange: null,
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
    isGameOver: false,
  });

  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHallOfFame(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse hall of fame", e);
      }
    }
  }, []);

  const saveToHallOfFame = (name: string) => {
    const entry: HallOfFameEntry = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      score: gameState.score,
      total: gameState.questions.length,
      mode: gameState.mode,
      difficulty: gameState.difficulty,
      selectedSifir: gameState.selectedSifir,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [...hallOfFame, entry];
    setHallOfFame(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const generateOptions = (answer: number, count: number): number[] => {
    const options = new Set<number>([answer]);
    
    while (options.size < count) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const wrong = Math.abs(answer + offset);
      if (wrong !== 0 && wrong !== answer) {
        options.add(wrong);
      }
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const startNormalGame = (n: number, diff: Difficulty) => {
    const numOptions = diff === Difficulty.EASY ? 2 : diff === Difficulty.MEDIUM ? 3 : 4;
    const questions: Question[] = Array.from({ length: 10 }, (_, i) => {
      const m = i + 1;
      const answer = m * n;
      return {
        m, n, answer,
        options: generateOptions(answer, numOptions)
      };
    });

    setGameState({
      ...gameState,
      mode: GameMode.NORMAL,
      difficulty: diff,
      selectedSifir: n,
      questions,
      score: 0,
      currentQuestionIndex: 0,
      isGameOver: false
    });
  };

  const startMemorizeGame = (range: [number, number]) => {
    const questions: Question[] = Array.from({ length: 25 }, () => {
      const n = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
      const m = Math.floor(Math.random() * 10) + 1;
      const answer = m * n;
      return {
        m, n, answer,
        options: generateOptions(answer, 3) // Fixed 3 for memorize
      };
    });

    setGameState({
      ...gameState,
      mode: GameMode.MEMORIZE,
      selectedRange: range,
      questions,
      score: 0,
      currentQuestionIndex: 0,
      isGameOver: false
    });
  };

  const handleFinish = (finalScore: number) => {
    setGameState(prev => ({ ...prev, score: finalScore, isGameOver: true }));
  };

  const handleQuit = () => {
    setGameState(prev => ({ ...prev, mode: GameMode.MENU, isGameOver: false }));
  };

  const showHallOfFame = () => {
    setGameState(prev => ({ ...prev, mode: GameMode.HALL_OF_FAME }));
  };

  return (
    <main className="min-h-screen bg-[#f0f9ff] text-slate-800 font-sans pb-20">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {gameState.mode === GameMode.MENU ? (
          <Menu 
            onStartNormal={startNormalGame} 
            onStartMemorize={startMemorizeGame} 
            onShowHallOfFame={showHallOfFame}
          />
        ) : gameState.mode === GameMode.HALL_OF_FAME ? (
          <HallOfFame entries={hallOfFame} onBack={handleQuit} />
        ) : gameState.isGameOver ? (
          <Result 
            score={gameState.score} 
            total={gameState.questions.length} 
            onSave={saveToHallOfFame}
            onRestart={() => {
                if (gameState.mode === GameMode.NORMAL && gameState.selectedSifir) {
                    startNormalGame(gameState.selectedSifir, gameState.difficulty);
                } else if (gameState.mode === GameMode.MEMORIZE && gameState.selectedRange) {
                    startMemorizeGame(gameState.selectedRange);
                }
            }}
            onMenu={handleQuit}
          />
        ) : (
          <GameContainer 
            mode={gameState.mode} 
            questions={gameState.questions} 
            onFinish={handleFinish}
            onQuit={handleQuit}
          />
        )}
      </div>
    </main>
  );
};

export default App;
