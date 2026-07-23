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
    <div className="flex flex-col items-center justify-between min-h-full py-3 space-y-5 animate-fadeIn">
      
      {/* Mobile Hero Header Asset Banner */}
      <div className="w-full relative rounded-3xl overflow-hidden border border-amber-500/30 game-card-panel shadow-2xl">
        <img 
          src="./assets/f1_car_hero.png" 
          alt="Formula 1 Hero" 
          className="w-full h-44 object-cover filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/40 to-transparent" />
        
        <div className="absolute bottom-3 left-4 right-4 text-left">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
            <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
            <span>KARTING HASTA LA FÓRMULA 1</span>
          </div>
          <h1 className="font-display text-3xl font-black text-white uppercase tracking-tight leading-none mt-1">
            ROAD TO <span className="gold-gradient-text">F1</span>
          </h1>
        </div>
      </div>

      {/* Mobile Vertical Info Cards */}
      <div className="w-full space-y-3">
        
        <div className="game-card-panel rounded-2xl p-3 border border-slate-800 flex items-center gap-3">
          <img src="./assets/karting_driver.png" alt="Karting" className="w-12 h-12 object-cover rounded-xl border border-slate-700 flex-shrink-0" />
          <div className="text-left">
            <h4 className="font-bold text-white text-xs">1. MUNDIAL DE KARTING CIK-FIA</h4>
            <p className="text-[10px] text-slate-400 leading-snug">Inicia tu carrera a los 14 años aprendiendo agilidad y reflejos en lluvia.</p>
          </div>
        </div>

        <div className="game-card-panel rounded-2xl p-3 border border-slate-800 flex items-center gap-3">
          <img src="./assets/f1_telemetry_hud.png" alt="Telemetry HUD" className="w-12 h-12 object-cover rounded-xl border border-slate-700 flex-shrink-0" />
          <div className="text-left">
            <h4 className="font-bold text-white text-xs">2. F4, F3 Y F2 JUNIOR LADDER</h4>
            <p className="text-[10px] text-slate-400 leading-snug">Acumula los 40 Puntos de Superlicencia FIA requeridos para la F1.</p>
          </div>
        </div>

        <div className="game-card-panel rounded-2xl p-3 border border-slate-800 flex items-center gap-3">
          <img src="./assets/f1_pitstop_crew.png" alt="F1 Pit Stop" className="w-12 h-12 object-cover rounded-xl border border-slate-700 flex-shrink-0" />
          <div className="text-left">
            <h4 className="font-bold text-white text-xs">3. FÓRMULA 1 WORLD CHAMPIONSHIP</h4>
            <p className="text-[10px] text-slate-400 leading-snug">Firma en Red Bull, Ferrari o McLaren y bate a Verstappen y Hamilton.</p>
          </div>
        </div>

      </div>

      {/* Mobile Big Thumb-Friendly CTA Button */}
      <div className="w-full pt-2">
        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-lg uppercase tracking-wider py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
        >
          <span>INICIAR MI CARRERA EN EL MOTORSPORT 🏎️</span>
          <Play className="w-5 h-5 fill-current" />
        </button>
      </div>

    </div>
  );
};
