
import React, { useState } from 'react';

interface ResultProps {
  score: number;
  total: number;
  onRestart: () => void;
  onMenu: () => void;
  onSave: (name: string) => void;
}

const Result: React.FC<ResultProps> = ({ score, total, onRestart, onMenu, onSave }) => {
  const [name, setName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const percentage = (score / total) * 100;
  
  let message = "Keep Practicing!";
  let emoji = "💪";
  let color = "text-yellow-500";

  if (percentage === 100) {
    message = "Perfect Score!";
    emoji = "🏆";
    color = "text-blue-600";
  } else if (percentage >= 80) {
    message = "Excellent Job!";
    emoji = "🌟";
    color = "text-green-500";
  } else if (percentage >= 50) {
    message = "Well Done!";
    emoji = "👍";
    color = "text-orange-500";
  }

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setIsSaved(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-8 animate-in zoom-in duration-500">
      <div className="bg-white rounded-[40px] shadow-2xl p-10 w-full text-center border-b-8 border-gray-100">
        <div className="text-8xl mb-6">{emoji}</div>
        <h2 className={`text-4xl font-black mb-2 ${color}`}>{message}</h2>
        
        <div className="my-8">
            <span className="text-gray-400 font-bold uppercase tracking-widest block text-sm">Your Final Score</span>
            <div className="text-7xl font-black text-gray-800">
                {score}<span className="text-gray-300 text-4xl">/{total}</span>
            </div>
        </div>

        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-8">
            <div className={`h-full ${percentage >= 80 ? 'bg-green-500' : 'bg-yellow-400'} transition-all duration-1000`} style={{ width: `${percentage}%` }} />
        </div>

        {!isSaved ? (
          <div className="bg-blue-50 p-6 rounded-3xl mb-8 border-2 border-blue-100">
            <h3 className="text-blue-600 font-black text-lg mb-4 uppercase tracking-tighter">Save to Hall of Fame</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="YOUR NAME"
              className="w-full p-4 rounded-2xl border-none text-center text-xl font-black text-blue-800 placeholder:text-blue-200 focus:ring-4 focus:ring-blue-200 transition-all outline-none"
              maxLength={15}
            />
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-md transition-all active:scale-95"
            >
              RECORD SCORE
            </button>
          </div>
        ) : (
          <div className="bg-green-50 p-6 rounded-3xl mb-8 border-2 border-green-100 animate-in fade-in zoom-in">
             <i className="fas fa-check-circle text-green-500 text-3xl mb-2"></i>
             <div className="text-green-700 font-black uppercase tracking-tighter">Score Saved!</div>
          </div>
        )}

        <div className="flex flex-col gap-4">
            <button 
                onClick={onRestart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl text-xl shadow-lg transition-all active:scale-95"
            >
                TRY AGAIN
            </button>
            <button 
                onClick={onMenu}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-5 rounded-3xl text-xl transition-all active:scale-95"
            >
                MAIN MENU
            </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
