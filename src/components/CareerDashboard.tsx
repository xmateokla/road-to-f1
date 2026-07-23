import React, { useState } from 'react';
import type { Driver, SeasonSummary } from '../types/f1';
import { getTeamById } from '../data/f1Teams';
import { simulateFullSeason, playF1AudioEffect } from '../utils/f1Simulator';
import { OffseasonSillySeasonModal } from './OffseasonSillySeasonModal';
import { OffseasonEngineeringModal } from './OffseasonEngineeringModal';
import { Trophy, Play, Swords } from 'lucide-react';

interface CareerDashboardProps {
  driver: Driver;
  onUpdateDriver: (updated: Driver) => void;
  seasonYear: number;
  onAdvanceSeasonYear: () => void;
  careerHistory: SeasonSummary[];
  onAddSeasonHistory: (summary: SeasonSummary) => void;
}

export const CareerDashboard: React.FC<CareerDashboardProps> = ({
  driver,
  onUpdateDriver,
  seasonYear,
  onAdvanceSeasonYear,
  careerHistory,
  onAddSeasonHistory,
}) => {
  const [showSillySeasonModal, setShowSillySeasonModal] = useState(false);
  const [showEngineeringModal, setShowEngineeringModal] = useState(false);

  const currentTeam = getTeamById(driver.currentTeamId);

  const handleSimulateSeason = () => {
    playF1AudioEffect('engine_rev');
    const result = simulateFullSeason(driver, seasonYear);
    onAddSeasonHistory(result.summary);
    onUpdateDriver(result.updatedDriver);
    onAdvanceSeasonYear();

    if (result.updatedDriver.contractYearsRemaining <= 0) {
      setShowSillySeasonModal(true);
    } else {
      setShowEngineeringModal(true);
    }
  };

  const handleContractComplete = (updatedDriver: Driver) => {
    onUpdateDriver(updatedDriver);
    setShowSillySeasonModal(false);
    setShowEngineeringModal(true);
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      
      {/* Mobile Top Broadcast Header Card */}
      <div className="game-card-panel rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
            <div 
              className="absolute inset-0 rounded-full border-2 blur-[3px] opacity-70"
              style={{ borderColor: driver.helmetColor, backgroundColor: driver.helmetColor }}
            />
            <img src="./assets/f1_racing_helmet.png" alt="F1 Helmet" className="w-12 h-12 object-contain relative z-10 drop-shadow-xl" />
          </div>

          <div className="space-y-0.5 text-left flex-1 min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-display font-black text-lg text-white truncate">#{driver.racingNumber} {driver.name}</span>
              <img src={driver.flagUrl} alt={driver.country} className="w-4 h-3 object-cover rounded shadow flex-shrink-0" />
            </div>

            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase">
                {driver.currentTier}
              </span>
              <span className="text-slate-300 font-semibold truncate">{currentTeam.name}</span>
            </div>
          </div>
        </div>

        {/* 3 Telemetry Pill Badges */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80">
          <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <div className="text-[8px] text-slate-400 font-bold uppercase">RATING OVR</div>
            <div className="font-display font-black text-base text-emerald-400 leading-none">{driver.overallRating}</div>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <div className="text-[8px] text-slate-400 font-bold uppercase">SUPERLICENCIA</div>
            <div className="font-display font-black text-base text-amber-400 leading-none">{driver.superlicencePoints}/40</div>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <div className="text-[8px] text-slate-400 font-bold uppercase">GANANCIAS</div>
            <div className="font-display font-black text-base text-white leading-none">${driver.earningsMillions.toFixed(1)}M</div>
          </div>
        </div>
      </div>

      {/* Teammate H2H Duel Box */}
      <div className="game-card-panel rounded-xl p-3 border border-slate-800 flex items-center justify-between text-left">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-amber-400" />
          <div className="text-xs">
            <span className="text-slate-400 font-bold">Rival Garaje: </span>
            <span className="text-white font-bold">{currentTeam.teammateName} ({currentTeam.teammateOvr} OVR)</span>
          </div>
        </div>
        <span className="text-[10px] bg-slate-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-slate-800">
          Auto: {currentTeam.carPerformanceIndex} OVR
        </span>
      </div>

      {/* Big Action Button */}
      <button
        onClick={handleSimulateSeason}
        className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-base uppercase py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
      >
        <span>SIMULAR TEMPORADA {seasonYear} 🏎️💨</span>
        <Play className="w-5 h-5 fill-current" />
      </button>

      {/* Seasons Feed */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-display font-black text-white uppercase flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>HISTORIAL CRONOLÓGICO</span>
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {careerHistory.length} SEASONS
          </span>
        </div>

        {careerHistory.length === 0 ? (
          <div className="game-card-panel rounded-2xl p-6 border border-slate-800 text-center space-y-1">
            <div className="text-3xl">🏎️</div>
            <h4 className="font-bold text-white text-sm">AÚN NO HAS SIMULADO TU PRIMER CAMPEONATO</h4>
            <p className="text-[10px] text-slate-400">Haz clic arriba para iniciar tu camino en el motorsport.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {careerHistory.slice().reverse().map((season, idx) => {
              const isLatest = idx === 0;
              return (
                <div
                  key={season.year}
                  className={`game-card-panel rounded-2xl p-3.5 border text-left space-y-2.5 transition-all ${
                    isLatest ? 'border-amber-400/80 bg-amber-950/10 gold-glow' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-black text-white text-sm">AÑO {season.year}</span>
                      <span className="bg-amber-500/20 text-amber-300 font-bold text-[9px] px-1.5 py-0.5 rounded uppercase">
                        {season.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {season.summaryBadge}
                    </span>
                  </div>

                  {/* 4-Stat Grid for Mobile */}
                  <div className="grid grid-cols-4 gap-1.5 text-center bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-[8px] text-slate-400 font-bold">POS</div>
                      <div className="font-display font-black text-base text-amber-400 leading-none">P{season.championshipRank}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-slate-400 font-bold">PUNTOS</div>
                      <div className="font-display font-black text-base text-white leading-none">{season.championshipPoints}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-slate-400 font-bold">WINS</div>
                      <div className="font-display font-black text-base text-emerald-400 leading-none">{season.wins}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-slate-400 font-bold">H2H</div>
                      <div className="font-display font-black text-base text-purple-400 leading-none">{season.teammateH2hWins}</div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-300 italic leading-snug">
                    "{season.seasonNarrative}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showSillySeasonModal && (
        <OffseasonSillySeasonModal driver={driver} onSelectContract={handleContractComplete} />
      )}

      {showEngineeringModal && (
        <OffseasonEngineeringModal
          driver={driver}
          onComplete={updatedDriver => {
            onUpdateDriver(updatedDriver);
            setShowEngineeringModal(false);
          }}
        />
      )}

    </div>
  );
};
