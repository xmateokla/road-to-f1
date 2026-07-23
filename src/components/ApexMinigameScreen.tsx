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
      if (score >= 88 && score <= 96) ovrDelta = 2;
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
    <div className="w-full space-y-4 text-center animate-fadeIn my-auto">
      
      <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
        <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
        <span>COMBINE DE PRECISIÓN EN EL APEX 🏎️</span>
      </div>

      <div className="space-y-1">
        <h2 className="font-display font-black text-2xl text-white uppercase">
          PRUEBA DE FRENADA
        </h2>
        <p className="text-xs text-slate-300">
          Haz clic en <strong className="text-amber-400">"¡FRENAR AHORA!"</strong> al pasar por la <span className="text-emerald-400 font-bold">ZONA APEX (88%-96%)</span>.
        </p>
      </div>

      {/* Meter Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
        <div className="relative w-full h-10 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex items-center">
          <div className="h-full bg-red-950/60 w-[70%]" />
          <div className="h-full bg-amber-950/80 w-[18%]" />
          <div className="h-full bg-emerald-500/80 w-[8%] flex items-center justify-center text-[8px] font-black text-black uppercase">
            APEX
          </div>
          <div className="h-full bg-amber-950/80 w-[4%]" />

          <div 
            className="absolute top-0 bottom-0 w-3 bg-amber-400 border border-white shadow-xl transition-all duration-75"
            style={{ left: `${meterValue}%` }}
          />
        </div>

        {score !== null && (
          <div className={`p-3 rounded-xl border text-xs font-bold ${
            score >= 88 && score <= 96 ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-red-950/80 border-red-500 text-red-300'
          }`}>
            {score >= 88 && score <= 96 ? '🌟 ¡APEX PERFECTO! (+2 OVR)' : '⚠️ FRENADA TARDÍA (-1 OVR)'}
          </div>
        )}

        <div className="pt-1">
          {!isRunning && score === null && (
            <button onClick={handleStart} className="w-full bg-amber-500 text-black font-display font-black text-sm uppercase py-3 rounded-xl shadow-lg">
              INICIAR VUELTA ⏱️
            </button>
          )}

          {isRunning && (
            <button onClick={handleStop} className="w-full bg-emerald-500 text-black font-display font-black text-base uppercase py-3.5 rounded-xl shadow-xl animate-pulse">
              ¡FRENAR AHORA! 🏎️💨
            </button>
          )}

          {!isRunning && score !== null && (
            <button onClick={handleContinue} className="w-full bg-amber-500 text-black font-display font-black text-sm uppercase py-3 rounded-xl shadow-lg inline-flex items-center justify-center gap-1">
              <span>CONTINUAR</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
