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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-5xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>OFFSEASON TELEMETRY & ENGINEERING SUITE 🏎️</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white uppercase">
              DESARROLLO DE MONOPLAZA & DEBRIEF DE EQUIPO
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">PRESUPUESTO DISPONIBLE</span>
              <span className="font-display font-black text-xl text-emerald-400 leading-none">
                ${currentDriver.earningsMillions.toFixed(1)}M USD
              </span>
            </div>
          </div>
        </div>

        {/* TEAM PRINCIPAL DEBRIEF BOX */}
        <div className="game-card-panel rounded-2xl p-4 border border-amber-500/30 bg-amber-950/20 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎙️</span>
            <h4 className="font-display font-bold text-amber-300 text-sm uppercase">
              DEBRIEF CON {team.teamPrincipal.toUpperCase()} ({team.name})
            </h4>
          </div>
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "Tu rendimiento contra {team.teammateName} ha sido evaluado en telemetría. Invierte tu presupuesto en desarrollo aerodinámico para la próxima temporada."
          </p>
        </div>

        {/* UPGRADES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upgrades.map(upg => (
            <div
              key={upg.id}
              className={`game-card-panel rounded-3xl p-5 border text-left space-y-3 transition-all ${
                upg.bought ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{upg.icon}</span>
                  <h4 className="font-bold text-white text-base">{upg.name}</h4>
                </div>
                <span className="text-xs font-bold text-emerald-400">${upg.costMillions}M USD</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{upg.description}</p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                {upg.bought ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>MEJORA INSTALADA EN CHASIS</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleBuyUpgrade(upg)}
                    disabled={currentDriver.earningsMillions < upg.costMillions}
                    className={`w-full font-display font-black text-xs uppercase py-2.5 rounded-xl transition-all ${
                      currentDriver.earningsMillions >= upg.costMillions
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black shadow-lg'
                        : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                    }`}
                  >
                    {currentDriver.earningsMillions >= upg.costMillions ? 'COMPRAR MEJORA DE CHASIS 🔧' : 'FONDOS INSUFICIENTES'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleFinishOffseason}
            className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 hover:from-emerald-400 text-black font-display font-black text-base uppercase px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>CONCLUIR OFFSEASON Y CONTINUAR 🏎️</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
