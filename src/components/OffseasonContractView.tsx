import React from 'react';
import type { Driver, ContractOffer } from '../types/f1';
import { getTeamById } from '../data/f1Teams';
import { generateOffseasonContractOffers, playF1AudioEffect } from '../utils/f1Simulator';
import { ArrowRight, Flame, AlertTriangle } from 'lucide-react';

interface OffseasonContractViewProps {
  driver: Driver;
  onSelectContract: (updatedDriver: Driver, chosenOffer: ContractOffer) => void;
}

export const OffseasonContractView: React.FC<OffseasonContractViewProps> = ({
  driver,
  onSelectContract,
}) => {
  const offers = generateOffseasonContractOffers(driver);

  const handleAcceptOffer = (offer: ContractOffer) => {
    playF1AudioEffect('pitstop');

    const updatedDriver: Driver = {
      ...driver,
      currentTier: offer.category,
      currentTeamId: offer.teamId,
      contractYearsRemaining: offer.contractYears,
      contractSalaryMillions: offer.salaryMillions,
      reputation: driver.reputation + 5,
    };

    onSelectContract(updatedDriver, offer);
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      
      {/* Offseason Banner */}
      <div className="game-card-panel rounded-2xl p-4 border border-amber-500/40 bg-amber-950/20 text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>SILLY SEASON • MERCADO DE PILOTOS FIA</span>
        </div>
        <h2 className="font-display font-black text-xl text-white uppercase">
          OFERTAS DE CONTRATO DISPONIBLES
        </h2>
        <p className="text-xs text-slate-300">
          Superlicencia FIA acumulada: <strong className="text-amber-400 font-display text-sm">{driver.superlicencePoints} / 40 PTS</strong>
        </p>
      </div>

      {/* List of All Offers (Rendered inline in main feed, 100% visible, ZERO cutoff!) */}
      <div className="space-y-3">
        {offers.map(offer => {
          const team = getTeamById(offer.teamId);
          const isF1 = offer.category === 'FORMULA_1';
          const meetsSuperlicence = driver.superlicencePoints >= offer.requiredSuperlicencePoints || !isF1;

          return (
            <div
              key={offer.id}
              className={`game-card-panel rounded-2xl p-4 border text-left space-y-3 transition-all ${
                isF1 ? 'border-amber-400/80 bg-amber-950/20 gold-glow' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              {/* Top Row: Team Logo + Team Name + Category Badge */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-950 rounded-xl p-2 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  <img 
                    src={team.logoUrl} 
                    alt={team.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-[10px] uppercase">{team.category}</span>
                    <span className="font-bold text-emerald-400 text-xs">${offer.salaryMillions}M USD/Año</span>
                  </div>
                  <h3 className="font-display font-black text-base text-white truncate">{team.fullName}</h3>
                  <div className="text-[10px] text-slate-400">Jefe: {team.teamPrincipal} • Auto: {team.carPerformanceIndex} OVR</div>
                </div>
              </div>

              {/* Pitch Quote */}
              <p className="text-xs text-slate-300 italic leading-relaxed bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                "{offer.pitchText}"
              </p>

              {/* Status and Action Button */}
              <div className="pt-1">
                {meetsSuperlicence ? (
                  <button
                    onClick={() => handleAcceptOffer(offer)}
                    className="w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 hover:from-emerald-400 text-black font-display font-black text-xs uppercase py-3 rounded-xl shadow-lg inline-flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span>FIRMAR CONTRATO CON {team.name.toUpperCase()} ✍️</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[10px] font-bold p-2.5 rounded-xl text-center flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>FALTAN PUNTOS DE SUPERLICENCIA ({offer.requiredSuperlicencePoints} PTS REQUERIDOS)</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
