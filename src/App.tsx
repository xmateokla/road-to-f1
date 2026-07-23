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
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {driver && phase !== 'WELCOME' && (
        <Navbar
          driver={driver}
          currentYear={seasonYear}
          onResetGame={handleResetGame}
        />
      )}

      <main className="flex-1">
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

      <footer className="border-t border-slate-900 bg-slate-950/90 py-4 px-4 text-center text-xs text-slate-500">
        <p>ROAD TO F1 • Simulador de Carrera FIA & Driver Academies © 2026. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
