import React, { useState } from 'react';
import type { Driver, EngineeringUpgrade } from '../types/f1';
import { getTeamById } from '../data/f1Teams';
import { playF1AudioEffect } from '../utils/f1Simulator';
import { Wrench, ArrowRight, CheckCircle } from 'lucide-react';

interface OffseasonEngineeringModalProps {
  driver: Driver;
  onComplete: (updatedDriver: Driver) => void;
}

export const INITIAL_UPGRADES: EngineeringUpgrade[] = [
  {
    id: 'upg_wind_tunnel',
    name: 'Túnel de Viento & Suelo Aerodinámico',
    category: 'aerodynamics',
    costMillions: 1.2,
    performanceBonus: 2,
    attributeBoosts: { qualifyingPace: 2, consistency: 1 },
    description: 'Optimización de flujo difusor trasero y carga aerodinámica en curvas rápidas.',
    icon: '🌪️',
    bought: false,
  },
  {
    id: 'upg_ers_hybrid',
    name: 'Mapeo ERS & Unidad de Potencia Híbrida',
    category: 'power_unit',
    costMillions: 1.8,
    performanceBonus: 3,
    attributeBoosts: { racecraft: 2, focusUnderPressure: 1 },
    description: 'Aumento de despliegue MGU-K en rectas largas para facilitar adelantamientos.',
    icon: '⚡',
    bought: false,
  },
  {
    id: 'upg_hq_simulator',
    name: 'Simulador HQ de Fibra de Carbono',
    category: 'simulator',
    costMillions: 0.8,
    performanceBonus: 1,
    attributeBoosts: { consistency: 2, wetWeatherSkill: 1 },
    description: 'Entrenamiento de trazada ideal y puntos de frenada bajo lluvia en simulador directo.',
    icon: '🕹️',
    bought: false,
  },
  {
    id: 'upg_pitstop_rig',
    name: 'Pistolas Neumáticas & Entrenamiento de Pits',
    category: 'chassis',
    costMillions: 0.6,
    performanceBonus: 1,
    attributeBoosts: { focusUnderPressure: 2, tireManagement: 1 },
    description: 'Reducción del tiempo de parada en boxes a menos de 2.2 segundos.',
    icon: '🛞',
    bought: false,
  },
];

export const OffseasonEngineeringModal: React.FC<OffseasonEngineeringModalProps> = ({
  driver,
  onComplete,
}) => {
  const [currentDriver, setCurrentDriver] = useState<Driver>(driver);
  const [upgrades, setUpgrades] = useState<EngineeringUpgrade[]>(INITIAL_UPGRADES);

  const team = getTeamById(currentDriver.currentTeamId);

  const handleBuyUpgrade = (upg: EngineeringUpgrade) => {
    if (currentDriver.earningsMillions < upg.costMillions) return;

    playF1AudioEffect('pitstop');

    const updatedAttrs = { ...currentDriver.attributes };
    if (upg.attributeBoosts) {
      for (const k in upg.attributeBoosts) {
        const key = k as keyof typeof updatedAttrs;
        updatedAttrs[key] = Math.min(99, (updatedAttrs[key] || 60) + (upg.attributeBoosts[key] || 0));
      }
    }

    const updatedDriver: Driver = {
      ...currentDriver,
      earningsMillions: currentDriver.earningsMillions - upg.costMillions,
      overallRating: currentDriver.overallRating + 1,
      attributes: updatedAttrs,
    };

    setCurrentDriver(updatedDriver);
    setUpgrades(prev => prev.map(u => u.id === upg.id ? { ...u, bought: true } : u));
  };

  const handleFinishOffseason = () => {
    playF1AudioEffect('engine_rev');
    onComplete(currentDriver);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-4 space-y-4 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
              <Wrench className="w-3 h-3 text-amber-400" />
              <span>GARAGE & TELEMETRÍA 🏎️</span>
            </div>
            <h2 className="font-display font-black text-xl text-white uppercase">
              DESARROLLO DE MONOPLAZA
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-right">
            <span className="text-[8px] text-slate-400 font-bold uppercase block">FONDOS</span>
            <span className="font-display font-black text-sm text-emerald-400 leading-none">
              ${currentDriver.earningsMillions.toFixed(1)}M
            </span>
          </div>
        </div>

        {/* Debrief Box */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-amber-500/30 text-left space-y-1">
          <div className="text-[10px] font-bold text-amber-400 uppercase">🎙️ DEBRIEF: {team.teamPrincipal}</div>
          <p className="text-[10px] text-slate-300 italic leading-snug">
            "Invierte el presupuesto de patrocinadores en aerodinámica para batir a {team.teammateName}."
          </p>
        </div>

        {/* Upgrades Single-Column */}
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {upgrades.map(upg => (
            <div
              key={upg.id}
              className={`game-card-panel rounded-xl p-3 border text-left space-y-1.5 ${
                upg.bought ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{upg.icon}</span>
                  <h4 className="font-bold text-white text-xs">{upg.name}</h4>
                </div>
                <span className="text-xs font-bold text-emerald-400">${upg.costMillions}M</span>
              </div>

              <p className="text-[9px] text-slate-400 leading-snug">{upg.description}</p>

              <div className="pt-1 flex items-center justify-between">
                {upg.bought ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>INSTALADO EN CHASIS</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuyUpgrade(upg)}
                    disabled={currentDriver.earningsMillions < upg.costMillions}
                    className={`w-full font-display font-black text-[10px] uppercase py-2 rounded-lg ${
                      currentDriver.earningsMillions >= upg.costMillions
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {currentDriver.earningsMillions >= upg.costMillions ? 'MEJORAR CHASIS 🔧' : 'SIN FONDOS'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleFinishOffseason}
            className="w-full bg-emerald-500 text-black font-display font-black text-xs uppercase py-3 rounded-xl shadow-lg inline-flex items-center justify-center gap-1"
          >
            <span>CONTINUAR 🏎️</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
