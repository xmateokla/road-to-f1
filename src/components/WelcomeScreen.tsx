import React from 'react';
import { Sparkles, Play } from 'lucide-react';
import { playF1AudioEffect } from '../utils/f1Simulator';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const handleStart = () => {
    playF1AudioEffect('engine_rev');
    onStart();
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      
      {/* Background Neon Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-950 to-slate-950 pointer-events-none" />
      
      <div className="max-w-5xl w-full game-card-panel rounded-3xl p-6 sm:p-12 space-y-8 holographic-edge shadow-2xl relative z-10 my-auto text-center">
        
        {/* Top Broadcast Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="font-display font-black text-xs text-amber-400 uppercase tracking-widest">
              FIA MOTORSPORT SIMULATOR SUITE 2026
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-[10px] text-slate-400 font-bold">
            EDICIÓN FIA SUPERLICENCE
          </div>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider gold-glow">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>DESDE EL MUNDIAL DE KARTING HASTA LA FÓRMULA 1</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-black text-white tracking-tight uppercase leading-none">
            ROAD TO <span className="gold-gradient-text">FÓRMULA 1</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-medium">
            Crea tu piloto, afíliate a academias de élite como Red Bull Junior o Ferrari FDA, escala por la F4, F3 y F2 acumulando Puntos de Superlicencia FIA y firma en la Fórmula 1 para ganar el Campeonato Mundial.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 max-w-md mx-auto">
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-2xl uppercase tracking-wider py-5 rounded-2xl shadow-2xl shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center justify-center gap-3"
          >
            <span>INICIAR MI CARRERA EN EL MOTORSPORT 🏎️</span>
            <Play className="w-6 h-6 fill-current" />
          </button>
        </div>

      </div>
    </div>
  );
};
