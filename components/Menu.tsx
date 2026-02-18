
import React from 'react';
import { GameMode, Difficulty } from '../types';

interface MenuProps {
  onStartNormal: (sifir: number, difficulty: Difficulty) => void;
  onStartMemorize: (range: [number, number]) => void;
  onShowHallOfFame: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStartNormal, onStartMemorize, onShowHallOfFame }) => {
  const [selectedSifir, setSelectedSifir] = React.useState(2);
  const [difficulty, setDifficulty] = React.useState<Difficulty>(Difficulty.EASY);
  const [rangeStart, setRangeStart] = React.useState(2);
  const [rangeEnd, setRangeEnd] = React.useState(5);

  const sifirOptions = Array.from({ length: 11 }, (_, i) => i + 2);

  return (
    <div className="relative flex flex-col gap-8 max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Small Hall of Fame button in the corner */}
      <button 
        onClick={onShowHallOfFame}
        className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl shadow-md flex items-center justify-center transform hover:rotate-12 transition-all active:scale-90 z-10"
        title="Hall of Fame"
      >
        <i className="fas fa-crown text-lg"></i>
      </button>

      <header className="text-center">
        <h1 className="text-5xl font-black text-blue-600 mb-2 drop-shadow-sm">Sifir Master</h1>
        <p className="text-gray-600 font-medium">Master your multiplication tables with ease!</p>
      </header>

      {/* Game 1: Jom Sifir (Sequential Mode) */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border-t-8 border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-600 mb-4 flex items-center gap-2">
          <i className="fas fa-list-ol"></i> Jom Sifir
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Choose Table (Sifir)</label>
            <div className="grid grid-cols-5 gap-2">
              {sifirOptions.map(n => (
                <button
                  key={n}
                  onClick={() => setSelectedSifir(n)}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    selectedSifir === n ? 'bg-yellow-400 text-white scale-105 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
            <div className="flex flex-col gap-2">
              {Object.values(Difficulty).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-2 px-4 rounded-xl font-bold text-left capitalize transition-all ${
                    difficulty === d ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => onStartNormal(selectedSifir, difficulty)}
          className="w-full mt-8 bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl text-xl shadow-lg transform active:scale-95 transition-all"
        >
          START SIFIR {selectedSifir}
        </button>
      </section>

      {/* Game 2: Memorize Mode */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border-t-8 border-purple-400">
        <h2 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
          <i className="fas fa-brain"></i> Memorize Mode
        </h2>
        <div className="flex flex-col gap-4">
          <p className="text-gray-600 text-sm">25 random questions from your chosen range. Fixed 3 choices.</p>
          <div className="flex items-center justify-between gap-4 bg-gray-50 p-4 rounded-2xl">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">From</label>
              <select 
                value={rangeStart} 
                onChange={(e) => setRangeStart(Number(e.target.value))}
                className="w-full bg-transparent border-none text-xl font-bold text-purple-700 focus:ring-0"
              >
                {sifirOptions.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">To</label>
              <select 
                value={rangeEnd} 
                onChange={(e) => setRangeEnd(Number(e.target.value))}
                className="w-full bg-transparent border-none text-xl font-bold text-purple-700 focus:ring-0"
              >
                {sifirOptions.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={() => onStartMemorize([Math.min(rangeStart, rangeEnd), Math.max(rangeStart, rangeEnd)])}
            className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white font-black py-4 rounded-2xl text-xl shadow-lg transform active:scale-95 transition-all"
          >
            START CHALLENGE
          </button>
        </div>
      </section>
    </div>
  );
};

export default Menu;
