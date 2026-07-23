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
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-2xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Branding & Driver Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏎️</span>
            <span className="font-display font-black text-xl text-white uppercase tracking-tight hidden sm:inline">
              ROAD TO <span className="gold-gradient-text">F1</span>
            </span>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">#{driver.racingNumber} {driver.name}</span>
            <span className="bg-amber-500/20 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded border border-amber-500/30 uppercase">
              {driver.currentTier}
            </span>
          </div>
        </div>

        {/* Right: Controls & Reset */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-[11px] font-bold text-slate-300">
            AÑO {currentYear}
          </div>

          <button
            onClick={onResetGame}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5"
            title="Reiniciar Carrera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">REINICIAR</span>
          </button>
        </div>

      </div>
    </header>
  );
};
