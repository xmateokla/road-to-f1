import React, { useState } from 'react';
import type { Driver, ContractOffer } from '../types/f1';
import { getTeamById } from '../data/f1Teams';
import { generateOffseasonContractOffers, playF1AudioEffect } from '../utils/f1Simulator';
import { ArrowRight, Flame, AlertTriangle, ChevronRight, ChevronLeft } from 'lucide-react';

interface OffseasonSillySeasonModalProps {
  driver: Driver;
  onSelectContract: (updatedDriver: Driver, chosenOffer: ContractOffer) => void;
}

export const OffseasonSillySeasonModal: React.FC<OffseasonSillySeasonModalProps> = ({
  driver,
  onSelectContract,
}) => {
  const offers = generateOffseasonContractOffers(driver);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentOffer = offers[selectedIndex] || offers[0];
  const team = getTeamById(currentOffer.teamId);
  const isF1 = currentOffer.category === 'FORMULA_1';
  const meetsSuperlicence = driver.superlicencePoints >= currentOffer.requiredSuperlicencePoints || !isF1;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/95 backdrop-blur-xl animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>SILLY SEASON FIA 🏎️</span>
            </div>
            <h2 className="font-display font-black text-sm text-white uppercase mt-0.5">
              MERCADO DE CONTRATOS ({selectedIndex + 1}/{offers.length})
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-xl text-right">
            <span className="text-[7px] text-slate-400 font-bold uppercase block">SUPERLICENCIA</span>
            <span className="font-display font-black text-xs text-amber-400 leading-none">
              {driver.superlicencePoints}/40 PTS
            </span>
          </div>
        </div>

        {/* Tab Navigation Chips */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1">
          {offers.map((off, idx) => {
            const tm = getTeamById(off.teamId);
            const isActive = idx === selectedIndex;
            return (
              <button
                key={off.id}
                onClick={() => {
                  setSelectedIndex(idx);
                  playF1AudioEffect('pitstop');
                }}
                className={`flex-1 py-1 px-2 rounded-xl text-[9px] font-bold uppercase border transition-all truncate ${
                  isActive 
                    ? 'bg-amber-500 text-black border-amber-400 font-black shadow' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {tm.name}
              </button>
            );
          })}
        </div>

        {/* ACTIVE OFFER DISPLAY CARD WITH LOGO (COMPACT 100% VISIBLE) */}
        <div className="game-card-panel rounded-2xl p-3.5 border border-slate-800 text-left space-y-2.5 bg-slate-900/80 holographic-edge">
          
          {/* Logo + Team Name */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
            <div className="w-12 h-12 bg-slate-950 rounded-xl p-1.5 border border-slate-800 flex items-center justify-center flex-shrink-0">
              <img 
                src={team.logoUrl} 
                alt={team.name} 
                className="w-full h-full object-contain filter drop-shadow" 
                onError={(e) => {
                  // Fallback icon if logo URL has CORS issue
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-[10px] uppercase">{team.category}</span>
                <span className="font-bold text-emerald-400 text-xs">${currentOffer.salaryMillions}M/Año</span>
              </div>
              <h3 className="font-display font-black text-base text-white truncate">{team.fullName}</h3>
              <div className="text-[9px] text-slate-400">Jefe: {team.teamPrincipal}</div>
            </div>
          </div>

          {/* Pitch Text */}
          <p className="text-[10px] text-slate-300 italic leading-snug bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            "{currentOffer.pitchText}"
          </p>

          {/* Contract Details Pill Grid */}
          <div className="grid grid-cols-2 gap-2 text-center text-[9px] bg-slate-950 p-2 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block font-bold">DURACIÓN</span>
              <span className="text-white font-bold">{currentOffer.contractYears} AÑO(S)</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold">ESTATUS</span>
              <span className="text-amber-400 font-bold">{currentOffer.roleStatus.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* CTA Action Button */}
          <div className="pt-1">
            {meetsSuperlicence ? (
              <button
                onClick={() => handleAcceptOffer(currentOffer)}
                className="w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 hover:from-emerald-400 text-black font-display font-black text-xs uppercase py-3 rounded-xl shadow-lg inline-flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <span>FIRMAR CONTRATO CON {team.name.toUpperCase()} ✍️</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[10px] font-bold p-2.5 rounded-xl text-center flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>FALTAN PUNTOS DE SUPERLICENCIA ({currentOffer.requiredSuperlicencePoints} PTS REQUERIDOS)</span>
              </div>
            )}
          </div>

        </div>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              setSelectedIndex(prev => (prev > 0 ? prev - 1 : offers.length - 1));
              playF1AudioEffect('pitstop');
            }}
            className="bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px] uppercase px-3 py-1.5 rounded-xl inline-flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>ANTERIOR</span>
          </button>

          <button
            onClick={() => {
              setSelectedIndex(prev => (prev < offers.length - 1 ? prev + 1 : 0));
              playF1AudioEffect('pitstop');
            }}
            className="bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px] uppercase px-3 py-1.5 rounded-xl inline-flex items-center gap-1"
          >
            <span>SIGUIENTE</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
