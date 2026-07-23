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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-5xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>MERCADO DE FICHAJES • SILLY SEASON FIA 🏎️</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase">
              OFERTAS DE CONTRATO Y JEFES DE EQUIPO
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">PUNTOS DE SUPERLICENCIA</span>
              <span className="font-display font-black text-xl text-amber-400 leading-none">
                {driver.superlicencePoints} / 40 PTS FIA
              </span>
            </div>
          </div>
        </div>

        {/* OFFERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map(offer => {
            const team = getTeamById(offer.teamId);
            const isF1 = offer.category === 'FORMULA_1';
            const meetsSuperlicence = driver.superlicencePoints >= offer.requiredSuperlicencePoints || !isF1;

            return (
              <div
                key={offer.id}
                className={`game-card-panel rounded-3xl p-5 border text-left space-y-4 transition-all holographic-edge card-hover-effect flex flex-col justify-between ${
                  isF1 ? 'border-amber-500/60 bg-amber-950/10 gold-glow' : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded border bg-slate-950 text-amber-400 border-slate-800">
                        {team.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        team.performanceTier === 'TOP_TIER' 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : team.performanceTier === 'UPPER_MIDFIELD'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : team.performanceTier === 'MIDFIELD'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {team.performanceTier.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">${offer.salaryMillions}M USD/Año</span>
                  </div>

                  <div>
                    <h3 className="font-display font-black text-2xl text-white">{team.fullName}</h3>
                    <div className="text-xs text-amber-400 font-bold">Jefe de Equipo: {team.teamPrincipal}</div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80 italic">
                    "{offer.pitchText}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      Rendimiento Monoplaza: <strong className="text-white">{team.carPerformanceIndex} OVR</strong>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      Estatus: <strong className="text-white">{offer.roleStatus.replace('_', ' ')}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  {meetsSuperlicence ? (
                    <button
                      onClick={() => handleAcceptOffer(offer)}
                      className="w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 hover:from-emerald-400 text-black font-display font-black text-sm uppercase py-3 rounded-xl shadow-lg transition-all inline-flex items-center justify-center gap-2"
                    >
                      <span>FIRMAR CONTRATO CON {team.name.toUpperCase()} ✍️</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold p-3 rounded-xl text-center flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>FALTAN PUNTOS DE SUPERLICENCIA FIA (Requiere {offer.requiredSuperlicencePoints} PTS)</span>
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
