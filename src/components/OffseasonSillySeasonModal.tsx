import React from 'react';
import type { Driver, ContractOffer } from '../types/f1';
import { getTeamById } from '../data/f1Teams';
import { generateOffseasonContractOffers, playF1AudioEffect } from '../utils/f1Simulator';
import { ArrowRight, Flame, AlertTriangle } from 'lucide-react';

interface OffseasonSillySeasonModalProps {
  driver: Driver;
  onSelectContract: (updatedDriver: Driver, chosenOffer: ContractOffer) => void;
}

export const OffseasonSillySeasonModal: React.FC<OffseasonSillySeasonModalProps> = ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-4 space-y-4 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>SILLY SEASON FIA 🏎️</span>
            </div>
            <h2 className="font-display font-black text-xl text-white uppercase">
              OFERTAS DE CONTRATO
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-right">
            <span className="text-[8px] text-slate-400 font-bold uppercase block">SUPERLICENCIA</span>
            <span className="font-display font-black text-sm text-amber-400 leading-none">
              {driver.superlicencePoints} / 40 PTS
            </span>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
          {offers.map(offer => {
            const team = getTeamById(offer.teamId);
            const isF1 = offer.category === 'FORMULA_1';
            const meetsSuperlicence = driver.superlicencePoints >= offer.requiredSuperlicencePoints || !isF1;

            return (
              <div
                key={offer.id}
                className={`game-card-panel rounded-2xl p-3.5 border text-left space-y-2 transition-all ${
                  isF1 ? 'border-amber-500/60 bg-amber-950/20 gold-glow' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-xs">
                  <span className="font-bold text-amber-400 uppercase">{team.category}</span>
                  <span className="font-bold text-emerald-400">${offer.salaryMillions}M USD/Año</span>
                </div>

                <div>
                  <h3 className="font-display font-black text-base text-white">{team.fullName}</h3>
                  <div className="text-[10px] text-slate-400">Jefe: {team.teamPrincipal}</div>
                </div>

                <p className="text-[9px] text-slate-300 italic leading-snug bg-slate-950 p-2 rounded-lg border border-slate-800">
                  "{offer.pitchText}"
                </p>

                <div className="pt-1">
                  {meetsSuperlicence ? (
                    <button
                      onClick={() => handleAcceptOffer(offer)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-black font-display font-black text-xs uppercase py-2.5 rounded-xl shadow-lg inline-flex items-center justify-center gap-1"
                    >
                      <span>FIRMAR CONTRATO CON {team.name.toUpperCase()} ✍️</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[9px] font-bold p-2 rounded-xl text-center flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      <span>FALTAN PUNTOS SUPERLICENCIA (REQUIERE {offer.requiredSuperlicencePoints} PTS)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
