import React, { useState, useEffect } from 'react';
import type { Driver } from '../types/f1';
import { playF1AudioEffect } from '../utils/f1Simulator';
import { Zap, ArrowRight } from 'lucide-react';

interface ApexMinigameScreenProps {
  driver: Driver;
  onMinigameComplete: (updatedDriver: Driver) => void;
}

export const ApexMinigameScreen: React.FC<ApexMinigameScreenProps> = ({ driver, onMinigameComplete }) => {
  const [meterValue, setMeterValue] = useState(10);
  const [meterDirection, setMeterDirection] = useState<'up' | 'down'>('up');
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setMeterValue(prev => {
        if (prev >= 100) {
          setMeterDirection('down');
          return 98;
        }
        if (prev <= 0) {
          setMeterDirection('up');
          return 2;
        }
        return meterDirection === 'up' ? prev + 5 : prev - 5;
      });
    }, 18);
    return () => clearInterval(interval);
  }, [isRunning, meterDirection]);

  const handleStart = () => {
    setMeterValue(10);
    setMeterDirection('up');
    setIsRunning(true);
    setScore(null);
    playF1AudioEffect('engine_rev');
  };

  const handleStop = () => {
    setIsRunning(false);
    const finalScore = meterValue;
    setScore(finalScore);

    if (finalScore >= 88 && finalScore <= 96) {
      playF1AudioEffect('cheer');
    } else {
      playF1AudioEffect('pitstop');
    }
  };

  const handleContinue = () => {
    let ovrDelta = 0;
    if (score !== null) {
      if (score >= 88 && score <= 96) ovrDelta = 2; // Perfect apex braking
      else if (score >= 70) ovrDelta = 1;
      else ovrDelta = -1;
    }

    const updatedDriver: Driver = {
      ...driver,
      overallRating: Math.min(99, Math.max(60, driver.overallRating + ovrDelta)),
      reputation: driver.reputation + (ovrDelta > 0 ? 5 : 0),
    };

    onMinigameComplete(updatedDriver);
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 my-2 sm:my-6">
      <div className="game-card-panel border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 text-center holographic-edge">
        
        <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase">
          <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>MINIJUEGO DE FRENADA Y APEX EN SILVERSTONE</span>
        </div>

        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase">
            PRUEBA DE PRECISIÓN EN EL APEX 🏎️
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Haz clic en <strong className="text-amber-400">"¡FRENAR AHORA!"</strong> cuando la aguja cruce la <span className="text-emerald-400 font-bold">ZONA DE FRENADA PERFECTA (88% - 96%)</span>.
          </p>
        </div>

        {/* METER DISPLAY */}
        <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 space-y-5 max-w-lg mx-auto shadow-2xl relative overflow-hidden">
          
          <div className="relative w-full h-12 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex items-center">
            <div className="h-full bg-red-950/60 w-[70%]" />
            <div className="h-full bg-amber-950/80 w-[18%]" />
            <div className="h-full bg-emerald-500/80 w-[8%] flex items-center justify-center text-[10px] font-black text-black uppercase">
              APEX 🎯
            </div>
            <div className="h-full bg-amber-950/80 w-[4%]" />

            <div 
              className="absolute top-0 bottom-0 w-3.5 bg-amber-400 border-2 border-white shadow-xl transition-all duration-75"
              style={{ left: `${meterValue}%` }}
            />
          </div>

          {score === null ? (
            <div className="text-xs font-bold text-slate-400">
              {isRunning ? '⚡ LA TELEMETRÍA SE MUEVE EN TIEMPO REAL...' : 'HAZ CLIC ABAJO PARA INICIAR LA VUELTA'}
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border text-sm font-bold animate-fadeIn ${
              score >= 88 && score <= 96 
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                : score >= 70 
                ? 'bg-amber-950/80 border-amber-500 text-amber-300' 
                : 'bg-red-950/80 border-red-500 text-red-300'
            }`}>
              {score >= 88 && score <= 96 ? (
                <div>🌟 ¡APEX PERFECTO! ({score}%). Frenada tardía impecable sin bloquear neumáticos. (+2 OVR)</div>
              ) : score >= 70 ? (
                <div>👍 BUEN TIEMPO ({score}%). Entrada limpia a la curva. (+1 OVR)</div>
              ) : (
                <div>⚠️ BLOQUEO DE FRENOS ({score}%). Plano en el neumático delantero. (-1 OVR)</div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            {!isRunning && score === null && (
              <button
                onClick={handleStart}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-display font-black text-lg uppercase py-3.5 rounded-2xl shadow-xl transition-all"
              >
                INICIAR VUELTA DE CLASIFICACIÓN ⏱️
              </button>
            )}

            {isRunning && (
              <button
                onClick={handleStop}
                className="w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 text-black font-display font-black text-xl uppercase py-4 rounded-2xl shadow-2xl animate-pulse transition-all"
              >
                ¡FRENAR AHORA! 🏎️💨
              </button>
            )}

            {!isRunning && score !== null && (
              <button
                onClick={handleContinue}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-display font-black text-lg uppercase py-3.5 rounded-2xl shadow-xl transition-all inline-flex items-center justify-center gap-2"
              >
                <span>CONTINUAR AL MOTORSPORT DASHBOARD</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
