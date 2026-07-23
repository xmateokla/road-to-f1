import React, { useState } from 'react';
import type { Driver, CategoryTier, JuniorAcademyId, DriverAttributes } from '../types/f1';
import { JUNIOR_ACADEMIES_DATA } from '../data/f1Academies';
import { calculateDriverRating, playF1AudioEffect } from '../utils/f1Simulator';
import { ArrowRight } from 'lucide-react';

interface DriverCreatorProps {
  onComplete: (driver: Driver) => void;
}

export const COUNTRIES_LIST = [
  { code: 'co', name: 'Colombia', flagUrl: 'https://flagcdn.com/w40/co.png' },
  { code: 'ar', name: 'Argentina', flagUrl: 'https://flagcdn.com/w40/ar.png' },
  { code: 'mx', name: 'México', flagUrl: 'https://flagcdn.com/w40/mx.png' },
  { code: 'es', name: 'España', flagUrl: 'https://flagcdn.com/w40/es.png' },
  { code: 'us', name: 'Estados Unidos', flagUrl: 'https://flagcdn.com/w40/us.png' },
  { code: 'gb', name: 'Reino Unido', flagUrl: 'https://flagcdn.com/w40/gb.png' },
  { code: 'fr', name: 'Francia', flagUrl: 'https://flagcdn.com/w40/fr.png' },
  { code: 'de', name: 'Alemania', flagUrl: 'https://flagcdn.com/w40/de.png' },
  { code: 'it', name: 'Italia', flagUrl: 'https://flagcdn.com/w40/it.png' },
  { code: 'br', name: 'Brasil', flagUrl: 'https://flagcdn.com/w40/br.png' },
  { code: 'jp', name: 'Japón', flagUrl: 'https://flagcdn.com/w40/jp.png' },
  { code: 'cl', name: 'Chile', flagUrl: 'https://flagcdn.com/w40/cl.png' },
  { code: 'pe', name: 'Perú', flagUrl: 'https://flagcdn.com/w40/pe.png' },
];

export const DriverCreator: React.FC<DriverCreatorProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState('');
  const [country, setCountry] = useState(COUNTRIES_LIST[0]);
  const [racingNumber] = useState(12);
  const [helmetColor, setHelmetColor] = useState('#E8002D');
  const [academyId, setAcademyId] = useState<JuniorAcademyId>('red_bull');
  const [startingCategory, setStartingCategory] = useState<CategoryTier>('KARTS');

  const [attributes, setAttributes] = useState<DriverAttributes>({
    qualifyingPace: 68,
    racecraft: 70,
    tireManagement: 66,
    wetWeatherSkill: 72,
    consistency: 68,
    focusUnderPressure: 66,
    fitness: 70,
  });

  const liveOvr = calculateDriverRating({ attributes });
  const selectedAcademy = JUNIOR_ACADEMIES_DATA[academyId];

  const handleAcademySelect = (id: JuniorAcademyId) => {
    setAcademyId(id);
    playF1AudioEffect('pitstop');
    const academy = JUNIOR_ACADEMIES_DATA[id];
    if (academy.attributeBoosts) {
      setAttributes(prev => ({ ...prev, ...academy.attributeBoosts }));
    }
  };

  const handleAttributeChange = (key: keyof DriverAttributes, val: number) => {
    setAttributes(prev => ({ ...prev, [key]: val }));
  };

  const handleConfirm = () => {
    playF1AudioEffect('engine_rev');
    const defaultTeamId = startingCategory === 'KARTS' ? 'kart_tonykart' : 'f4_prema';

    const newDriver: Driver = {
      id: `driver_${Date.now()}`,
      name: name.trim() || 'Piloto de Promesa',
      country: country.name,
      flagUrl: country.flagUrl,
      racingNumber,
      helmetColor,
      age: startingCategory === 'KARTS' ? 14 : 16,
      currentTier: startingCategory,
      juniorAcademyId: academyId,
      overallRating: liveOvr,
      reputation: 50,
      marketability: academyId === 'privateer' ? 70 : 50,
      earningsMillions: academyId === 'privateer' ? 2.5 : 0.5,
      passiveIncomeMillions: 0,
      attributes,
      currentTeamId: defaultTeamId,
      superlicencePoints: 0,
      unlockedBadges: [selectedAcademy.badge],
      engineeringUpgrades: [],
      contractYearsRemaining: 1,
      contractSalaryMillions: 0.3,
    };

    onComplete(newDriver);
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      
      {/* Mobile Top Header Wizard */}
      <div className="game-card-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">PASO {step} DE 2</div>
          <h2 className="font-display font-black text-lg text-white uppercase leading-none">
            {step === 1 ? 'CREAR PILOTO FIA' : 'TELEMETRÍA & ENTRADA'}
          </h2>
        </div>

        <div className="game-card-gold px-3 py-1.5 rounded-xl text-center gold-glow">
          <div className="text-[8px] text-amber-400 font-black uppercase">OVR</div>
          <div className="font-display font-black text-xl gold-gradient-text leading-none">{liveOvr}</div>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          
          {/* 3D Helmet Preview Box */}
          <div className="game-card-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-around relative overflow-hidden">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div 
                className="absolute inset-0 rounded-full border-2 blur-[4px] opacity-70"
                style={{ borderColor: helmetColor, backgroundColor: helmetColor }}
              />
              <img src="./assets/f1_racing_helmet.png" alt="3D F1 Helmet" className="w-20 h-20 object-contain relative z-10 drop-shadow-xl" />
            </div>

            <div className="text-left space-y-1">
              <div className="font-display font-black text-xl text-white">#{racingNumber} {name || 'TU PILOTO'}</div>
              <div className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                <img src={country.flagUrl} alt={country.name} className="w-4 h-3 object-cover rounded" />
                <span>{country.name}</span>
              </div>
            </div>
          </div>

          {/* Form inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">NOMBRE DE PILOTO</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre del piloto..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">PAÍS</label>
                <select
                  value={country.code}
                  onChange={e => {
                    const found = COUNTRIES_LIST.find(c => c.code === e.target.value);
                    if (found) setCountry(found);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs outline-none"
                >
                  {COUNTRIES_LIST.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">COLOR CASCO</label>
                <input
                  type="color"
                  value={helmetColor}
                  onChange={e => setHelmetColor(e.target.value)}
                  className="w-full h-8 bg-slate-950 border border-slate-800 rounded-xl p-0.5 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Academies Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-[11px] font-bold text-amber-400 uppercase block">ACADEMIA F1 (JUNIOR PROGRAM)</label>
            <div className="space-y-2">
              {Object.values(JUNIOR_ACADEMIES_DATA).map(acad => {
                const isSelected = academyId === acad.id;
                return (
                  <button
                    key={acad.id}
                    type="button"
                    onClick={() => handleAcademySelect(acad.id)}
                    className={`w-full game-card-panel rounded-xl p-3 text-left transition-all ${
                      isSelected ? 'border-amber-400 game-card-gold gold-glow' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{acad.badge}</span>
                      <span className="text-[9px] font-black bg-slate-950 text-amber-400 px-2 py-0.5 rounded border border-slate-800">
                        {acad.pressureLevel}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1">{acad.scoutBonusText}</p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          
          {/* Entry Category */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase block">CATEGORÍA DE ENTRADA</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStartingCategory('KARTS')}
                className={`game-card-panel rounded-xl p-3 text-left space-y-1 ${
                  startingCategory === 'KARTS' ? 'border-amber-400 game-card-gold' : 'border-slate-800'
                }`}
              >
                <div className="text-xl">🏎️</div>
                <div className="font-bold text-white text-xs">Mundial Karting</div>
                <div className="text-[9px] text-slate-400">14 Años</div>
              </button>

              <button
                type="button"
                onClick={() => setStartingCategory('FORMULA_4')}
                className={`game-card-panel rounded-xl p-3 text-left space-y-1 ${
                  startingCategory === 'FORMULA_4' ? 'border-amber-400 game-card-gold' : 'border-slate-800'
                }`}
              >
                <div className="text-xl">🏎️💨</div>
                <div className="font-bold text-white text-xs">Fórmula 4</div>
                <div className="text-[9px] text-slate-400">16 Años</div>
              </button>
            </div>
          </div>

          {/* Telemetry Sliders */}
          <div className="game-card-panel rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase">ATRIBUTOS FIA ({liveOvr} OVR)</div>
            
            <div className="space-y-2">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>⏱️ Clasificación 1-Vuelta:</span>
                  <span className="text-amber-400">{attributes.qualifyingPace}</span>
                </div>
                <input type="range" min="50" max="80" value={attributes.qualifyingPace} onChange={e => handleAttributeChange('qualifyingPace', parseInt(e.target.value))} className="w-full accent-amber-400" />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>⚔️ Racecraft (Overtaking):</span>
                  <span className="text-amber-400">{attributes.racecraft}</span>
                </div>
                <input type="range" min="50" max="80" value={attributes.racecraft} onChange={e => handleAttributeChange('racecraft', parseInt(e.target.value))} className="w-full accent-amber-400" />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>🛞 Neumáticos & Ritmo:</span>
                  <span className="text-amber-400">{attributes.tireManagement}</span>
                </div>
                <input type="range" min="50" max="80" value={attributes.tireManagement} onChange={e => handleAttributeChange('tireManagement', parseInt(e.target.value))} className="w-full accent-amber-400" />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>🌧️ Habilidad Lluvia:</span>
                  <span className="text-amber-400">{attributes.wetWeatherSkill}</span>
                </div>
                <input type="range" min="50" max="80" value={attributes.wetWeatherSkill} onChange={e => handleAttributeChange('wetWeatherSkill', parseInt(e.target.value))} className="w-full accent-amber-400" />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Mobile Footer Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        {step > 1 ? (
          <button onClick={() => setStep(1)} className="bg-slate-900 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl">
            ← VOLVER
          </button>
        ) : <div />}

        {step === 1 ? (
          <button onClick={() => setStep(2)} className="bg-amber-500 text-black font-display font-black text-xs uppercase px-6 py-3 rounded-xl shadow-lg inline-flex items-center gap-1">
            <span>ATRIBUTOS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleConfirm} className="bg-emerald-500 text-black font-display font-black text-xs uppercase px-6 py-3 rounded-xl shadow-lg inline-flex items-center gap-1">
            <span>CONFIRMAR 🏎️</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
