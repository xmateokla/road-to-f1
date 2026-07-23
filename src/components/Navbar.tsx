import React from 'react';
import type { Driver } from '../types/f1';
import { RotateCcw } from 'lucide-react';

interface NavbarProps {
  driver: Driver;
  currentYear: number;
  onResetGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  driver,
  currentYear,
  onResetGame,
}) => {
  return (
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-900 px-3 py-2 flex items-center justify-between gap-2 shadow-xl z-30 select-none">
      
      {/* Left: Driver Tag */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-lg flex-shrink-0">🏎️</span>
        <div className="min-w-0 text-left">
          <div className="font-bold text-white text-xs truncate">#{driver.racingNumber} {driver.name}</div>
          <div className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">{driver.currentTier}</div>
        </div>
      </div>

      {/* Right: Year & Reset */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="bg-slate-900 border border-slate-800 text-slate-300 font-mono font-bold text-[10px] px-2 py-1 rounded-lg">
          AÑO {currentYear}
        </span>

        <button
          onClick={onResetGame}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white p-1.5 rounded-lg transition-all"
          title="Reiniciar Carrera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

    </header>
  );
};
