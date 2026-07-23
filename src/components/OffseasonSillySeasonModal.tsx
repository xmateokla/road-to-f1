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
  // Take top 3 contract offers max so they fit on screen without scrollbar!
  const allOffers = generateOffseasonContractOffers(driver);
  const offers = allOffers.slice(0, 3);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-3 space-y-2 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>SILLY SEASON FIA 🏎️</span>
            </div>
            <h2 className="font-display font-black text-base text-white uppercase leading-none mt-0.5">
              OFERTAS DE CONTRATO
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl text-right">
            <span className="text-[7px] text-slate-400 font-bold uppercase block">SUPERLICENCIA</span>
            <span className="font-display font-black text-xs text-amber-400 leading-none">
              {driver.superlicencePoints} / 40 PTS
            </span>
          </div>
        </div>

        {/* Offers List (NO SCROLLBAR, FITS ALL 3 OFFERS ON SCREEN) */}
        <div className="space-y-2">
          {offers.map(offer => {
            const team = getTeamById(offer.teamId);
            const isF1 = offer.category === 'FORMULA_1';
            const meetsSuperlicence = driver.superlicencePoints >= offer.requiredSuperlicencePoints || !isF1;

            return (
              <div
                key={offer.id}
                className={`game-card-panel rounded-xl p-2.5 border text-left space-y-1.5 transition-all ${
                  isF1 ? 'border-amber-500/60 bg-amber-950/20 gold-glow' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-400 uppercase">{team.category}</span>
                  <span className="font-bold text-emerald-400">${offer.salaryMillions}M/Año</span>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-sm text-white">{team.fullName}</h3>
                  <span className="text-[9px] text-slate-400">Jefe: {team.teamPrincipal}</span>
                </div>

                <p className="text-[8px] text-slate-300 italic leading-tight bg-slate-950 p-1.5 rounded border border-slate-800 line-clamp-2">
                  "{offer.pitchText}"
                </p>

                <div className="pt-0.5">
                  {meetsSuperlicence ? (
                    <button
                      onClick={() => handleAcceptOffer(offer)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-black font-display font-black text-[10px] uppercase py-2 rounded-lg shadow inline-flex items-center justify-center gap-1"
                    >
                      <span>FIRMAR CONTRATO ✍️</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[8px] font-bold p-1.5 rounded text-center flex items-center justify-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                      <span>FALTAN PUNTOS SUPERLICENCIA ({offer.requiredSuperlicencePoints} PTS REQUERIDOS)</span>
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
