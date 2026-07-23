import React, { useState } from 'react';
import type { Driver, SeasonSummary } from './types/f1';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DriverCreator } from './components/DriverCreator';
import { ApexMinigameScreen } from './components/ApexMinigameScreen';
import { CareerDashboard } from './components/CareerDashboard';

export type GamePhase = 'WELCOME' | 'DRIVER_CREATION' | 'APEX_MINIGAME' | 'SEASON_DASHBOARD';

export const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('WELCOME');
  const [driver, setDriver] = useState<Driver | null>(null);
  const [seasonYear, setSeasonYear] = useState<number>(2026);
  const [careerHistory, setCareerHistory] = useState<SeasonSummary[]>([]);

  const handleResetGame = () => {
    setPhase('WELCOME');
    setDriver(null);
    setSeasonYear(2026);
    setCareerHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 font-sans flex flex-col items-center justify-center p-0 sm:py-6 selection:bg-amber-500 selection:text-black">
      {/* MOBILE DEVICE CONTAINER SHELL */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[92vh] sm:max-h-[92vh] sm:rounded-[40px] bg-[#050811] border border-slate-800/80 shadow-2xl flex flex-col overflow-hidden relative sm:ring-1 sm:ring-amber-500/20">
        
        {/* Mobile Top Status Bar Simulation */}
        <div className="bg-slate-950 px-4 py-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-900 select-none">
          <span className="text-amber-400 font-mono">10:00 🏁</span>
          <span className="font-display uppercase tracking-widest text-[9px] text-slate-500">ROAD TO F1 MOBILE</span>
          <span className="text-emerald-400 font-mono">100% 🔋</span>
        </div>

        {driver && phase !== 'WELCOME' && (
          <Navbar
            driver={driver}
            currentYear={seasonYear}
            onResetGame={handleResetGame}
          />
        )}

        <main className="flex-1 overflow-y-auto custom-scrollbar p-3">
          {phase === 'WELCOME' && (
            <WelcomeScreen onStart={() => setPhase('DRIVER_CREATION')} />
          )}

          {phase === 'DRIVER_CREATION' && (
            <DriverCreator
              onComplete={createdDriver => {
                setDriver(createdDriver);
                setPhase('APEX_MINIGAME');
              }}
            />
          )}

          {phase === 'APEX_MINIGAME' && driver && (
            <ApexMinigameScreen
              driver={driver}
              onMinigameComplete={updatedDriver => {
                setDriver(updatedDriver);
                setPhase('SEASON_DASHBOARD');
              }}
            />
          )}

          {phase === 'SEASON_DASHBOARD' && driver && (
            <CareerDashboard
              driver={driver}
              onUpdateDriver={setDriver}
              seasonYear={seasonYear}
              onAdvanceSeasonYear={() => setSeasonYear(prev => prev + 1)}
              careerHistory={careerHistory}
              onAddSeasonHistory={summary => setCareerHistory(prev => [...prev, summary])}
            />
          )}
        </main>

        <footer className="border-t border-slate-900 bg-slate-950 py-2 px-3 text-center text-[10px] text-slate-500">
          <p>ROAD TO F1 • FIA Mobile Edition © 2026</p>
        </footer>

      </div>
    </div>
  );
};

export default App;
