
import React from 'react';
import { HallOfFameEntry, GameMode } from '../types';

interface HallOfFameProps {
  entries: HallOfFameEntry[];
  onBack: () => void;
}

const HallOfFame: React.FC<HallOfFameProps> = ({ entries, onBack }) => {
  const sortedEntries = [...entries].sort((a, b) => {
    const scorePctA = a.score / a.total;
    const scorePctB = b.score / b.total;
    if (scorePctB !== scorePctA) return scorePctB - scorePctA;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const normalEntries = sortedEntries.filter(e => e.mode === GameMode.NORMAL).slice(0, 10);
  const memorizeEntries = sortedEntries.filter(e => e.mode === GameMode.MEMORIZE).slice(0, 10);

  const Table = ({ title, data, color }: { title: string, data: HallOfFameEntry[], color: string }) => (
    <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border-b-4 border-gray-100">
      <div className={`${color} p-6 text-white`}>
        <h3 className="text-2xl font-black flex items-center gap-2">
          <i className="fas fa-crown text-yellow-300"></i> {title}
        </h3>
      </div>
      <div className="p-4">
        {data.length === 0 ? (
          <p className="text-gray-400 text-center py-8 font-medium">No records yet. Be the first!</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.map((entry, idx) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:scale-[1.02] transition-transform">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-blue-300'}`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-black text-gray-800 text-lg uppercase leading-tight">{entry.name}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
                      {entry.date} {entry.selectedSifir ? `• SIFIR ${entry.selectedSifir}` : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-blue-600 leading-tight">
                    {entry.score}<span className="text-sm text-gray-300">/{entry.total}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">{entry.difficulty || 'Normal'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <button onClick={onBack} className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors">
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="text-4xl font-black text-blue-600 drop-shadow-sm">Hall of Fame</h2>
        <div className="w-12"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Table title="Jom Sifir Top 10" data={normalEntries} color="bg-yellow-500" />
        <Table title="Memorize Top 10" data={memorizeEntries} color="bg-purple-600" />
      </div>

      <button
        onClick={onBack}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-xl shadow-lg transform active:scale-95 transition-all mt-4"
      >
        BACK TO MENU
      </button>
    </div>
  );
};

export default HallOfFame;
