import React, { useState } from 'react';
import type { Driver, SeasonSummary } from '../types/f1';
import { getTeamById } from '../data/f1Teams';
import { simulateFullSeason, playF1AudioEffect } from '../utils/f1Simulator';
import { OffseasonSillySeasonModal } from './OffseasonSillySeasonModal';
import { OffseasonEngineeringModal } from './OffseasonEngineeringModal';
import { Trophy, Flame, Play, Swords } from 'lucide-react';

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
  const championshipsCount = careerHistory.filter(s => s.championshipRank === 1).length;

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
    <div className="max-w-6xl mx-auto p-3 sm:p-6 my-2 sm:my-6 space-y-6">
      
      {/* DRIVER BROADCAST HEADER BAR */}
      <div className="game-card-panel border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl holographic-edge">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Driver Identity with 3D F1 Helmet Asset */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-full border-2 shadow-xl blur-[4px] opacity-70"
                style={{ borderColor: driver.helmetColor, backgroundColor: driver.helmetColor }}
              />
              <img 
                src="./assets/f1_racing_helmet.png" 
                alt="F1 Helmet" 
                className="w-14 h-14 object-contain relative z-10 drop-shadow-xl"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl text-white">#{driver.racingNumber} {driver.name}</span>
                <img src={driver.flagUrl} alt={driver.country} className="w-5 h-3.5 object-cover rounded shadow" />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                  {driver.currentTier}
                </span>
                <span className="text-slate-300 font-semibold">{currentTeam.fullName}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  currentTeam.performanceTier === 'TOP_TIER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                  currentTeam.performanceTier === 'UPPER_MIDFIELD' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                  currentTeam.performanceTier === 'MIDFIELD' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {currentTeam.performanceTier.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Telemetry Badges & Trophy Cabinet */}
          <div className="flex items-center gap-3">
            {championshipsCount > 0 && (
              <div className="bg-amber-950/40 border border-amber-500/50 px-3 py-1.5 rounded-2xl flex items-center gap-2">
                <img src="./assets/f1_podium_trophy.png" alt="Trophy" className="w-6 h-6 object-contain" />
                <div>
                  <div className="text-[8px] text-amber-400 font-bold uppercase">CAMPEONATOS</div>
                  <div className="font-display font-black text-lg text-amber-300 leading-none">{championshipsCount}</div>
                </div>
              </div>
            )}

            <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl text-center">
              <div className="text-[9px] text-slate-400 font-bold uppercase">RATING OVR</div>
              <div className="font-display font-black text-2xl text-emerald-400 leading-none">{driver.overallRating}</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl text-center">
              <div className="text-[9px] text-slate-400 font-bold uppercase">SUPERLICENCIA FIA</div>
              <div className="font-display font-black text-2xl text-amber-400 leading-none">{driver.superlicencePoints}/40</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl text-center">
              <div className="text-[9px] text-slate-400 font-bold uppercase">GANANCIAS</div>
              <div className="font-display font-black text-2xl text-white leading-none">${driver.earningsMillions.toFixed(1)}M</div>
            </div>
          </div>

        </div>
      </div>

      {/* TEAMMATE H2H DUEL DISPLAY */}
      <div className="game-card-panel rounded-3xl p-5 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Swords className="w-6 h-6 text-amber-400" />
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">DUELO DE EQUIPO TITULAR</div>
            <div className="font-display font-black text-lg text-white">
              Compañero de Garaje: <span className="text-amber-400">{currentTeam.teammateName} ({currentTeam.teammateOvr} OVR)</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-bold uppercase">CAR PERFORMANCE INDEX</div>
          <div className="font-display font-black text-xl text-emerald-400">{currentTeam.carPerformanceIndex} OVR</div>
        </div>
      </div>

      {/* SIMULATE SEASON ACTION PANEL */}
      <div className="game-card-panel border border-slate-800 rounded-3xl p-6 shadow-2xl holographic-edge flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>PRÓXIMO CAMPEONATO A DISPUTAR</span>
          </div>
          <h2 className="font-display text-3xl font-black text-white uppercase">
            TEMPORADA {seasonYear} • {driver.currentTier} ({currentTeam.name})
          </h2>
        </div>

        <button
          onClick={handleSimulateSeason}
          className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black font-display font-black text-xl uppercase px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center justify-center gap-3"
        >
          <span>SIMULAR TEMPORADA {seasonYear} 🏎️💨</span>
          <Play className="w-6 h-6 fill-current" />
        </button>
      </div>

      {/* CHRONOLOGICAL SEASONS FEED */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>HISTORIAL CRONOLÓGICO DE TEMPORADAS MOTORSPORT</span>
          </h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            {careerHistory.length} TEMPORADAS REGISTRADAS
          </span>
        </div>

        {careerHistory.length === 0 ? (
          <div className="game-card-panel rounded-3xl p-8 border border-slate-800 text-center space-y-2">
            <div className="text-4xl">🏎️</div>
            <h4 className="font-bold text-white text-lg">AÚN NO HAS SIMULADO TU PRIMER CAMPEONATO</h4>
            <p className="text-xs text-slate-400">Haz clic en "SIMULAR TEMPORADA" arriba para iniciar tu camino hacia la Fórmula 1.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {careerHistory.slice().reverse().map((season, idx) => {
              const isLatest = idx === 0;

              return (
                <div
                  key={season.year}
                  className={`game-card-panel rounded-3xl p-5 sm:p-6 border text-left space-y-4 transition-all holographic-edge card-hover-effect ${
                    isLatest ? 'border-amber-400/80 bg-amber-950/10 gold-glow' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-black text-2xl text-white">TEMPORADA {season.year}</span>
                      <span className="bg-slate-900 text-slate-300 font-bold text-xs px-2.5 py-0.5 rounded border border-slate-800">
                        {season.age} AÑOS
                      </span>
                      <span className="bg-amber-500/20 text-amber-300 font-bold text-xs px-2.5 py-0.5 rounded border border-amber-500/30 uppercase">
                        {season.category}
                      </span>
                      {isLatest && (
                        <span className="bg-amber-500 text-black font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase gold-glow">
                          📌 RECIÉN CONCLUIDA
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                      {season.summaryBadge}
                    </span>
                  </div>

                  {/* 6-STAT GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center bg-slate-950 border border-slate-800/80 rounded-2xl p-4">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">POSICIÓN FINAL</div>
                      <div className="font-display font-black text-2xl text-amber-400 leading-none">P{season.championshipRank}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">PUNTOS FIA</div>
                      <div className="font-display font-black text-2xl text-white leading-none">{season.championshipPoints}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">VICTORIAS</div>
                      <div className="font-display font-black text-2xl text-emerald-400 leading-none">{season.wins}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">PODIOS</div>
                      <div className="font-display font-black text-2xl text-blue-400 leading-none">{season.podiums}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">DUELO H2H</div>
                      <div className="font-display font-black text-2xl text-purple-400 leading-none">{season.teammateH2hWins}/{season.racesPlayed}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">+SUPERLICENCIA</div>
                      <div className="font-display font-black text-2xl text-amber-300 leading-none">+{season.superlicencePointsEarned}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{season.seasonNarrative}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SILLY SEASON MODAL IF CONTRACT EXPIRED */}
      {showSillySeasonModal && (
        <OffseasonSillySeasonModal
          driver={driver}
          onSelectContract={handleContractComplete}
        />
      )}

      {/* MOTORSPORT OFFSEASON ENGINEERING MODAL */}
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
