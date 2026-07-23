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
    name: 'Túnel de Viento & Suelo',
    category: 'aerodynamics',
    costMillions: 1.2,
    performanceBonus: 2,
    attributeBoosts: { qualifyingPace: 2, consistency: 1 },
    description: 'Mayor carga aerodinámica en curvas rápidas.',
    icon: '🌪️',
    bought: false,
  },
  {
    id: 'upg_ers_hybrid',
    name: 'Mapeo ERS Híbrido',
    category: 'power_unit',
    costMillions: 1.8,
    performanceBonus: 3,
    attributeBoosts: { racecraft: 2, focusUnderPressure: 1 },
    description: 'Mayor despliegue MGU-K en rectas largas.',
    icon: '⚡',
    bought: false,
  },
  {
    id: 'upg_hq_simulator',
    name: 'Simulador HQ Fibra Carbono',
    category: 'simulator',
    costMillions: 0.8,
    performanceBonus: 1,
    attributeBoosts: { consistency: 2, wetWeatherSkill: 1 },
    description: 'Entrenamiento de trazada ideal en lluvia.',
    icon: '🕹️',
    bought: false,
  },
  {
    id: 'upg_pitstop_rig',
    name: 'Entrenamiento de Pits',
    category: 'chassis',
    costMillions: 0.6,
    performanceBonus: 1,
    attributeBoosts: { focusUnderPressure: 2, tireManagement: 1 },
    description: 'Paradas en box por debajo de 2.2 segundos.',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-3 space-y-2.5 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <div>
            <div className="inline-flex items-center gap-1 bg-amber-500/15 text-amber-300 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">
              <Wrench className="w-3 h-3 text-amber-400" />
              <span>GARAGE & TELEMETRÍA 🏎️</span>
            </div>
            <h2 className="font-display font-black text-base text-white uppercase leading-none mt-0.5">
              DESARROLLO DE MONOPLAZA
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl text-right">
            <span className="text-[7px] text-slate-400 font-bold uppercase block">FONDOS</span>
            <span className="font-display font-black text-xs text-emerald-400 leading-none">
              ${currentDriver.earningsMillions.toFixed(1)}M
            </span>
          </div>
        </div>

        {/* Debrief Box */}
        <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-amber-500/30 text-left">
          <div className="text-[9px] font-bold text-amber-400 uppercase">🎙️ DEBRIEF: {team.teamPrincipal}</div>
          <p className="text-[9px] text-slate-300 italic leading-tight">
            "Invierte fondos en chasis para batir a {team.teammateName}."
          </p>
        </div>

        {/* 4 Upgrades Grid (NO SCROLLBAR, FITS PERFECTLY IN SCREEN) */}
        <div className="grid grid-cols-2 gap-1.5">
          {upgrades.map(upg => (
            <div
              key={upg.id}
              className={`game-card-panel rounded-xl p-2 border text-left space-y-1 ${
                upg.bought ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{upg.icon}</span>
                <span className="text-[9px] font-bold text-emerald-400">${upg.costMillions}M</span>
              </div>

              <div>
                <h4 className="font-bold text-white text-[10px] leading-tight truncate">{upg.name}</h4>
                <p className="text-[8px] text-slate-400 leading-tight line-clamp-1">{upg.description}</p>
              </div>

              <div className="pt-0.5">
                {upg.bought ? (
                  <span className="text-[8px] font-bold text-emerald-400 flex items-center gap-0.5 justify-center py-1 bg-emerald-950/40 rounded">
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                    <span>INSTALADO</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuyUpgrade(upg)}
                    disabled={currentDriver.earningsMillions < upg.costMillions}
                    className={`w-full font-display font-black text-[9px] uppercase py-1 rounded transition-all ${
                      currentDriver.earningsMillions >= upg.costMillions
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow'
                        : 'bg-slate-900 text-slate-600 border border-slate-800'
                    }`}
                  >
                    {currentDriver.earningsMillions >= upg.costMillions ? 'MEJORAR 🔧' : 'SIN FONDOS'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div className="pt-1 border-t border-slate-900">
          <button
            onClick={handleFinishOffseason}
            className="w-full bg-emerald-500 text-black font-display font-black text-xs uppercase py-2.5 rounded-xl shadow-lg inline-flex items-center justify-center gap-1"
          >
            <span>CONCLUIR OFFSEASON 🏎️</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
