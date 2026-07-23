import React, { useState } from 'react';
import type { Driver, CategoryTier, JuniorAcademyId, DriverAttributes } from '../types/f1';
import { JUNIOR_ACADEMIES_DATA } from '../data/f1Academies';
import { calculateDriverRating, playF1AudioEffect } from '../utils/f1Simulator';
import { Flag, User, Zap, Award, ArrowRight, Sliders } from 'lucide-react';

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

  // Identity Form State (EMPTY DEFAULT NAME so player types their own!)
  const [name, setName] = useState('');
  const [country, setCountry] = useState(COUNTRIES_LIST[0]);
  const [racingNumber, setRacingNumber] = useState(12);
  const [helmetColor, setHelmetColor] = useState('#E8002D');
  const [academyId, setAcademyId] = useState<JuniorAcademyId>('red_bull');
  const [startingCategory, setStartingCategory] = useState<CategoryTier>('KARTS');

  // Custom Attributes State
  const [attributes, setAttributes] = useState<DriverAttributes>({
    qualifyingPace: 72,
    racecraft: 74,
    tireManagement: 70,
    wetWeatherSkill: 75,
    consistency: 72,
    focusUnderPressure: 70,
    fitness: 75,
  });

  const liveOvr = calculateDriverRating({ attributes });
  const selectedAcademy = JUNIOR_ACADEMIES_DATA[academyId];

  const handleAcademySelect = (id: JuniorAcademyId) => {
    setAcademyId(id);
    playF1AudioEffect('pitstop');
    
    // Apply academy boost preview
    const academy = JUNIOR_ACADEMIES_DATA[id];
    if (academy.attributeBoosts) {
      setAttributes(prev => ({
        ...prev,
        ...academy.attributeBoosts,
      }));
    }
  };

  const handleAttributeChange = (key: keyof DriverAttributes, val: number) => {
    setAttributes(prev => ({
      ...prev,
      [key]: val,
    }));
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
      investments: [],
      contractYearsRemaining: 1,
      contractSalaryMillions: 0.3,
    };

    onComplete(newDriver);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-6 my-2 sm:my-6">
      <div className="game-card-panel border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 holographic-edge">
        
        {/* Header Wizard Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>PASO {step} DE 2 • ROAD TO F1 CREATOR SUITE</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {step === 1 && '1. IDENTIDAD, DORSAL & ACADEMIA FIA'}
              {step === 2 && '2. TELEMETRÍA, ATRIBUTOS Y CATEGORÍA INICIAL'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="game-card-gold px-4 py-2 rounded-2xl text-center gold-glow">
              <div className="text-[9px] text-amber-400 font-black uppercase">OVR RATING EN VIVO</div>
              <div className="font-display font-black text-3xl gold-gradient-text leading-none">{liveOvr}</div>
            </div>
          </div>
        </div>

        {/* STEP 1: IDENTITY, NUMBER & ACADEMY */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column Form */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>NOMBRE Y APELLIDO DEL PILOTO</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Escribe el nombre de tu piloto (ej. Juan Pablo Montoya)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white font-bold focus:border-amber-400 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Country Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-amber-400" />
                    <span>NACIONALIDAD DEL PILOTO</span>
                  </label>
                  <select
                    value={country.code}
                    onChange={e => {
                      const found = COUNTRIES_LIST.find(c => c.code === e.target.value);
                      if (found) setCountry(found);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-white font-bold focus:border-amber-400 outline-none"
                  >
                    {COUNTRIES_LIST.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Driver Number & Helmet Color */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase">DORSAL (#1 A #99)</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={racingNumber}
                      onChange={e => setRacingNumber(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase">COLOR DEL CASCO</label>
                    <input
                      type="color"
                      value={helmetColor}
                      onChange={e => setHelmetColor(e.target.value)}
                      className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl p-1 cursor-pointer"
                    />
                  </div>
                </div>

              </div>

              {/* Right REALISTIC 3D HELMET Asset Preview Card */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center game-card-panel rounded-3xl p-6 border border-slate-800 text-center space-y-4 relative overflow-hidden">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <div 
                    className="absolute inset-0 rounded-full border-4 shadow-2xl transition-all blur-[6px] opacity-60"
                    style={{ borderColor: helmetColor, backgroundColor: helmetColor }}
                  />
                  <img 
                    src="./assets/f1_racing_helmet.png" 
                    alt="Realistic F1 Racing Helmet"
                    className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-all duration-300"
                  />
                </div>

                <div>
                  <div className="font-display font-black text-2xl text-white">#{racingNumber} {name || 'TU PILOTO'}</div>
                  <div className="text-xs text-slate-300 flex items-center justify-center gap-1.5 mt-1 font-semibold">
                    <img src={country.flagUrl} alt={country.name} className="w-5 h-3.5 object-cover rounded shadow" />
                    <span>{country.name}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* JUNIOR ACADEMIES SELECTOR */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>AFILIACIÓN A ACADEMIAS DE FÓRMULA 1 (JUNIOR PROGRAM)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.values(JUNIOR_ACADEMIES_DATA).map(acad => {
                  const isSelected = academyId === acad.id;
                  return (
                    <button
                      key={acad.id}
                      type="button"
                      onClick={() => handleAcademySelect(acad.id)}
                      className={`game-card-panel rounded-2xl p-4 text-left space-y-2 transition-all holographic-edge card-hover-effect ${
                        isSelected ? 'border-amber-400 game-card-gold gold-glow' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{acad.badge}</span>
                        <span className="text-[9px] font-black bg-slate-900 text-amber-400 px-2 py-0.5 rounded border border-slate-800">
                          {acad.pressureLevel}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{acad.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{acad.description}</p>
                      <div className="text-[10px] font-bold text-emerald-400 pt-1">
                        Efecto: {acad.scoutBonusText}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: TELEMETRY ATTRIBUTES & STARTING CATEGORY */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Starting Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase">CATEGORÍA DE ENTRADA AL MOTORSPORT</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStartingCategory('KARTS')}
                  className={`game-card-panel rounded-2xl p-4 text-left space-y-2 transition-all holographic-edge card-hover-effect ${
                    startingCategory === 'KARTS' ? 'border-amber-400 game-card-gold gold-glow' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🏎️</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded">Edad: 14 Años</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Campeonato Mundial de Karting (CIK-FIA)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Formación pura en karting internacional. El camino más realista desde abajo.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setStartingCategory('FORMULA_4')}
                  className={`game-card-panel rounded-2xl p-4 text-left space-y-2 transition-all holographic-edge card-hover-effect ${
                    startingCategory === 'FORMULA_4' ? 'border-amber-400 game-card-gold gold-glow' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🏎️💨</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded">Edad: 16 Años</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Campeonato de Fórmula 4 (F4)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Salto directo a monoplazas de fibra de carbono con alas aerodinámicas.</p>
                </button>
              </div>
            </div>

            {/* TELEMETRY ATTRIBUTES SLIDERS */}
            <div className="game-card-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>ASIGNADOR DE ATRIBUTOS DE PILOTAJE (ESCALA FIA)</span>
                </span>
                <span className="font-display font-black text-2xl text-emerald-400">{liveOvr} OVR</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">⏱️ Clasificación 1-Vuelta:</span>
                    <span className="text-amber-400 font-display text-lg">{attributes.qualifyingPace}</span>
                  </div>
                  <input
                    type="range" min="50" max="85" value={attributes.qualifyingPace}
                    onChange={e => handleAttributeChange('qualifyingPace', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">⚔️ Rueda a Rueda (Racecraft):</span>
                    <span className="text-amber-400 font-display text-lg">{attributes.racecraft}</span>
                  </div>
                  <input
                    type="range" min="50" max="85" value={attributes.racecraft}
                    onChange={e => handleAttributeChange('racecraft', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🛞 Gestión de Neumáticos:</span>
                    <span className="text-amber-400 font-display text-lg">{attributes.tireManagement}</span>
                  </div>
                  <input
                    type="range" min="50" max="85" value={attributes.tireManagement}
                    onChange={e => handleAttributeChange('tireManagement', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🌧️ Habilidad en Lluvia:</span>
                    <span className="text-amber-400 font-display text-lg">{attributes.wetWeatherSkill}</span>
                  </div>
                  <input
                    type="range" min="50" max="85" value={attributes.wetWeatherSkill}
                    onChange={e => handleAttributeChange('wetWeatherSkill', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🎯 Consistencia (Sin Errores):</span>
                    <span className="text-amber-400 font-display text-lg">{attributes.consistency}</span>
                  </div>
                  <input
                    type="range" min="50" max="85" value={attributes.consistency}
                    onChange={e => handleAttributeChange('consistency', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">🔥 Enfoque Bajo Presión:</span>
                    <span className="text-amber-400 font-display text-lg">{attributes.focusUnderPressure}</span>
                  </div>
                  <input
                    type="range" min="50" max="85" value={attributes.focusUnderPressure}
                    onChange={e => handleAttributeChange('focusUnderPressure', parseInt(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs uppercase px-5 py-3 rounded-2xl transition-all"
            >
              ← REGRESAR AL PASO 1
            </button>
          ) : <div />}

          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-display font-black text-sm uppercase px-8 py-3.5 rounded-2xl shadow-lg transition-all inline-flex items-center gap-2"
            >
              <span>IR A ATRIBUTOS & TELEMETRÍA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 hover:from-emerald-400 text-black font-display font-black text-base uppercase px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <span>CONFIRMAR PILOTO E IR AL APEX COMBINE 🏎️</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
