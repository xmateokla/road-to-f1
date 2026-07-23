import React from 'react';
import { Sparkles, Play, Shield, Award, Trophy } from 'lucide-react';
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
    <div className="min-h-[90vh] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      
      {/* Hero F1 Car Background with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="./assets/f1_car_hero.png" 
          alt="Formula 1 Car Hero" 
          className="w-full h-full object-cover opacity-25 filter blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/80 to-transparent" />
      </div>
      
      <div className="max-w-5xl w-full game-card-panel rounded-3xl p-6 sm:p-12 space-y-8 holographic-edge shadow-2xl relative z-10 my-auto text-center border border-amber-500/20">
        
        {/* Top Broadcast Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="font-display font-black text-xs text-amber-400 uppercase tracking-widest">
              FIA MOTORSPORT SIMULATOR SUITE 2026
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 px-3.5 py-1 rounded-full text-[10px] text-amber-300 font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>EDICIÓN FIA SUPERLICENCE</span>
          </div>
        </div>

        {/* Hero Title & Visual Assets */}
        <div className="space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider gold-glow">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>DESDE EL MUNDIAL DE KARTING HASTA LA FÓRMULA 1</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-black text-white tracking-tight uppercase leading-none">
            ROAD TO <span className="gold-gradient-text">FÓRMULA 1</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-medium">
            Crea tu piloto, afíliate a academias de élite (Red Bull Junior, Ferrari FDA, Mercedes, McLaren), escala por F4, F3 y F2 acumulando Puntos de Superlicencia FIA y firma en la F1 para ganar el Campeonato Mundial.
          </p>

          {/* Quick Feature Badges Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center">
              <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-300 uppercase">5 CATEGORÍAS FIA</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center">
              <Trophy className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-300 uppercase">10 ESCUDERÍAS F1</div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center">
              <Shield className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <div className="text-[10px] font-bold text-slate-300 uppercase">40 PTS SUPERLICENCIA</div>
            </div>
          </div>
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
