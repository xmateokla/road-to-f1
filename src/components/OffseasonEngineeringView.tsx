import React, { useState } from 'react';
import type { Driver, EngineeringUpgrade } from '../types/f1';
import { getTeamById } from '../data/f1Teams';
import { playF1AudioEffect } from '../utils/f1Simulator';
import { Wrench, ArrowRight, CheckCircle } from 'lucide-react';

interface OffseasonEngineeringViewProps {
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

export const OffseasonEngineeringView: React.FC<OffseasonEngineeringViewProps> = ({
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
    <div className="w-full space-y-4 animate-fadeIn">
      
      {/* Header */}
      <div className="game-card-panel rounded-2xl p-4 border border-amber-500/40 bg-amber-950/20 text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <span>OFFSEASON TELEMETRY & GARAGE 🏎️</span>
        </div>
        <h2 className="font-display font-black text-xl text-white uppercase">
          DESARROLLO DE MONOPLAZA & CHASIS
        </h2>
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-300 font-semibold">{team.fullName}</span>
          <span className="font-display font-black text-emerald-400 text-sm">
            FONDOS: ${currentDriver.earningsMillions.toFixed(1)}M USD
          </span>
        </div>
      </div>

      {/* Debrief Box */}
      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-left space-y-1">
        <div className="text-[10px] font-bold text-amber-400 uppercase">🎙️ DEBRIEF DE EQUIPO: {team.teamPrincipal}</div>
        <p className="text-xs text-slate-300 italic leading-relaxed">
          "Tu rendimiento ha sido evaluado en telemetría. Invierte tus ganancias en mejoras aerodinámicas para batir a {team.teammateName}."
        </p>
      </div>

      {/* Upgrades List (Inline in main scrollable view, 100% visible!) */}
      <div className="space-y-3">
        {upgrades.map(upg => (
          <div
            key={upg.id}
            className={`game-card-panel rounded-2xl p-4 border text-left space-y-2 transition-all ${
              upg.bought ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800 bg-slate-900/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{upg.icon}</span>
                <h4 className="font-bold text-white text-sm">{upg.name}</h4>
              </div>
              <span className="text-xs font-bold text-emerald-400">${upg.costMillions}M USD</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{upg.description}</p>

            <div className="pt-1">
              {upg.bought ? (
                <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs p-2 rounded-xl text-center flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>MEJORA INSTALADA EN EL MONOPLAZA</span>
                </div>
              ) : (
                <button
                  onClick={() => handleBuyUpgrade(upg)}
                  disabled={currentDriver.earningsMillions < upg.costMillions}
                  className={`w-full font-display font-black text-xs uppercase py-2.5 rounded-xl transition-all ${
                    currentDriver.earningsMillions >= upg.costMillions
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg'
                      : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                  }`}
                >
                  {currentDriver.earningsMillions >= upg.costMillions ? 'MEJORAR CHASIS 🔧' : 'FONDOS INSUFICIENTES'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Continue CTA */}
      <div className="pt-2">
        <button
          onClick={handleFinishOffseason}
          className="w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 hover:from-emerald-400 text-black font-display font-black text-sm uppercase py-3.5 rounded-2xl shadow-xl inline-flex items-center justify-center gap-2"
        >
          <span>CONCLUIR OFFSEASON Y CONTINUAR 🏎️</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
