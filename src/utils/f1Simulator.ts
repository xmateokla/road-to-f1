import type { Driver, DriverAttributes, F1Team, SeasonSummary, ContractOffer, RaceWeekendResult } from '../types/f1';
import type { TrackInfo } from '../data/f1Tracks';
import { getTeamById } from '../data/f1Teams';
import { OFFICIAL_TRACKS } from '../data/f1Tracks';

// Audio Web Audio API synthesizer for F1 engine revs, pitstop impacts, and trophies
export const playF1AudioEffect = (type: 'engine_rev' | 'pitstop' | 'cheer' | 'radio_static' | 'crash') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'engine_rev') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } else if (type === 'pitstop') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'radio_static') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {}
};

// Calculate Overall Rating (OVR)
export const calculateDriverRating = (driver: Partial<Driver>): number => {
  const attrs = driver.attributes || {
    qualifyingPace: 70,
    racecraft: 70,
    tireManagement: 70,
    wetWeatherSkill: 70,
    consistency: 70,
    focusUnderPressure: 70,
    fitness: 70,
  };

  const weights = {
    qualifyingPace: 0.22,
    racecraft: 0.20,
    tireManagement: 0.16,
    wetWeatherSkill: 0.12,
    consistency: 0.14,
    focusUnderPressure: 0.10,
    fitness: 0.06,
  };

  let rating = 0;
  for (const key in weights) {
    rating += (attrs[key as keyof typeof attrs] || 50) * weights[key as keyof typeof weights];
  }

  return Math.min(99, Math.max(60, Math.round(rating)));
};

// SIMULATE A SINGLE GRAND PRIX RACE WEEKEND
export const simulateRaceWeekend = (
  driver: Driver,
  team: F1Team,
  track: TrackInfo,
  apexMinigameScore: number | null
): RaceWeekendResult => {
  const driverRating = driver.overallRating;
  const carPerformance = team.carPerformanceIndex;

  // Combine Driver Skill (40%) and Car Performance (60%) for realistic hierarchy
  let combinedPace = (driverRating * 0.40) + (carPerformance * 0.60);

  // Apex Minigame Bonus (-2 to +4 positions impact)
  if (apexMinigameScore !== null) {
    if (apexMinigameScore >= 90) combinedPace += 4;
    else if (apexMinigameScore >= 75) combinedPace += 2;
    else combinedPace -= 3;
  }

  // Weather Roll
  const isRain = Math.random() < track.rainProbability;
  const weather: RaceWeekendResult['weather'] = isRain 
    ? (Math.random() < 0.3 ? 'TORMENTA_TORRENCIAL' : 'LLUVIA_LIGERA')
    : 'SECO';

  if (weather !== 'SECO') {
    // Wet weather skill gives massive advantage in rain
    const wetBonus = (driver.attributes.wetWeatherSkill - 70) * 0.15;
    combinedPace += wetBonus;
  }

  // DNF Risk (Street circuits + low consistency)
  const dnfRisk = (track.isStreetCircuit ? 0.08 : 0.03) + (driver.attributes.consistency < 65 ? 0.05 : 0);
  const isDnf = Math.random() < dnfRisk;

  if (isDnf) {
    const reasons = [
      'Accidente en la curva de Sainte Dévote contra el muro',
      'Fallo en la unidad de potencia y pérdida de presión de aceite',
      'Bloqueo de frenos y colisión contra las protecciones',
      'Pinchazo repentino en el neumático trasero a alta velocidad',
    ];
    return {
      trackName: track.name,
      country: track.country,
      flagUrl: track.flagUrl,
      gridPosition: Math.min(20, Math.max(1, Math.round(21 - (combinedPace / 5)))),
      raceFinishPosition: 20,
      pointsScored: 0,
      fastestLap: false,
      podium: false,
      win: false,
      dnf: true,
      dnfReason: reasons[Math.floor(Math.random() * reasons.length)],
      weather,
      raceStory: 'Abandono prematuro. La carrera terminó antes de tiempo para el piloto.',
    };
  }

  // Calculate Finish Position (1 to 20)
  const totalFieldPace = combinedPace + (Math.random() * 12 - 6);
  let finishPos = Math.min(20, Math.max(1, Math.round(21.5 - (totalFieldPace / 4.8))));

  // F1 Points System (25, 18, 15, 12, 10, 8, 6, 4, 2, 1)
  const f1Points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const pointsScored = finishPos <= 10 ? f1Points[finishPos - 1] : 0;
  const isWin = finishPos === 1;
  const isPodium = finishPos <= 3;
  const isFastestLap = isPodium && Math.random() < 0.35;

  let story = `P3 en la parrilla. Carrera sólida finalizando en P${finishPos}.`;
  if (isWin) story = `🏆 ¡VICTORIA ESPECTACULAR EN ${track.name.toUpperCase()}! Pilotaje de leyenda sin cometer errores.`;
  else if (isPodium) story = `🍾 ¡PODIO! Subida al cajón tras una batalla feroz rueda a rueda.`;
  else if (finishPos <= 10) story = `Puntos valiosos para el campeonato terminando en P${finishPos}.`;

  return {
    trackName: track.name,
    country: track.country,
    flagUrl: track.flagUrl,
    gridPosition: Math.min(20, Math.max(1, Math.round(finishPos + (Math.random() * 4 - 2)))),
    raceFinishPosition: finishPos,
    pointsScored,
    fastestLap: isFastestLap,
    podium: isPodium,
    win: isWin,
    dnf: false,
    weather,
    raceStory: story,
  };
};

// SIMULATE A FULL SEASON (14-22 RACES)
export const simulateFullSeason = (
  driver: Driver,
  seasonYear: number
): {
  summary: SeasonSummary;
  newOvr: number;
  newSuperlicencePoints: number;
  updatedDriver: Driver;
} => {
  const currentCategory = driver.currentTier;
  const team = getTeamById(driver.currentTeamId);

  // Determine race count by category
  const totalRaces = currentCategory === 'FORMULA_1' ? 22 : currentCategory === 'FORMULA_2' ? 14 : 10;

  let totalPoints = 0;
  let wins = 0;
  let podiums = 0;
  let poles = 0;
  let fastestLaps = 0;

  // Simulate individual races
  for (let r = 0; r < totalRaces; r++) {
    const track = OFFICIAL_TRACKS[r % OFFICIAL_TRACKS.length];
    const res = simulateRaceWeekend(driver, team, track, null);

    totalPoints += res.pointsScored;
    if (res.win) wins++;
    if (res.podium) podiums++;
    if (res.gridPosition === 1) poles++;
    if (res.fastestLap) fastestLaps++;
  }

  // Calculate Championship Rank (1st = Champion, 2nd, etc.)
  let rank = 12;
  if (team.performanceTier === 'TOP_TIER') {
    rank = totalPoints >= 280 ? 1 : totalPoints >= 220 ? 2 : 3;
  } else if (team.performanceTier === 'UPPER_MIDFIELD') {
    rank = totalPoints >= 220 ? 2 : totalPoints >= 160 ? 4 : 6;
  } else if (team.performanceTier === 'MIDFIELD') {
    rank = totalPoints >= 120 ? 6 : totalPoints >= 70 ? 8 : 10;
  } else {
    rank = totalPoints >= 40 ? 10 : 14;
  }

  // FIA Official Superlicence Points Allocation (3-Year Rolling Total)
  let superlicenceEarned = 0;
  if (currentCategory === 'FORMULA_2') {
    if (rank === 1) superlicenceEarned = 40; // Direct F1 Eligibility!
    else if (rank === 2) superlicenceEarned = 30;
    else if (rank === 3) superlicenceEarned = 20;
    else if (rank <= 5) superlicenceEarned = 10;
  } else if (currentCategory === 'FORMULA_3') {
    if (rank === 1) superlicenceEarned = 30;
    else if (rank === 2) superlicenceEarned = 25;
    else if (rank <= 4) superlicenceEarned = 15;
  } else if (currentCategory === 'FORMULA_4') {
    if (rank === 1) superlicenceEarned = 12;
    else if (rank <= 3) superlicenceEarned = 7;
  } else if (currentCategory === 'KARTS') {
    if (rank === 1) superlicenceEarned = 5;
  }

  const updatedSuperlicence = Math.min(50, driver.superlicencePoints + superlicenceEarned);

  // Progression & Aging
  let ovrDelta = 0;
  if (driver.age <= 20) ovrDelta = rank <= 3 ? 3 : 2;
  else if (driver.age <= 26) ovrDelta = rank <= 3 ? 2 : 1;
  else ovrDelta = -1;

  const newOvr = Math.min(99, Math.max(60, driver.overallRating + ovrDelta));

  // Sync attributes with new OVR
  const updatedAttrs = { ...driver.attributes };
  if (driver.overallRating > 0 && newOvr !== driver.overallRating) {
    const ratio = newOvr / driver.overallRating;
    (Object.keys(updatedAttrs) as (keyof DriverAttributes)[]).forEach(k => {
      updatedAttrs[k] = Math.max(45, Math.min(99, Math.round((updatedAttrs[k] || 60) * ratio)));
    });
  }

  // Salary
  const salaryBase = currentCategory === 'FORMULA_1' 
    ? (newOvr >= 92 ? 35.0 : newOvr >= 85 ? 18.0 : 6.0)
    : (currentCategory === 'FORMULA_2' ? 0.8 : 0.2);

  let summaryBadge = 'Temporada Sólida';
  if (rank === 1) summaryBadge = `🏆 CAMPEÓN MUNDIAL DE ${currentCategory}`;
  else if (podiums >= 5) summaryBadge = '🍾 Coleccionista de Podios';

  const summary: SeasonSummary = {
    year: seasonYear,
    age: driver.age,
    category: currentCategory,
    teamId: team.id,
    teamName: team.name,
    racesPlayed: totalRaces,
    wins,
    podiums,
    poles,
    fastestLaps,
    championshipPoints: totalPoints,
    championshipRank: rank,
    superlicencePointsEarned: superlicenceEarned,
    earnedSalaryMillions: salaryBase,
    summaryBadge,
    seasonNarrative: rank === 1 
      ? `¡TEMPORADA CONSAGRATORIA! Te coronas Campeón de ${currentCategory} tras dominar el campeonato.`
      : `Finalizas P${rank} en el campeonato con ${totalPoints} puntos acumulados.`,
  };

  const updatedDriver: Driver = {
    ...driver,
    age: driver.age + 1,
    overallRating: newOvr,
    attributes: updatedAttrs,
    superlicencePoints: updatedSuperlicence,
    earningsMillions: driver.earningsMillions + salaryBase,
    contractYearsRemaining: Math.max(0, driver.contractYearsRemaining - 1),
  };

  return {
    summary,
    newOvr,
    newSuperlicencePoints: updatedSuperlicence,
    updatedDriver,
  };
};

// GENERATE SILLY SEASON CONTRACT OFFERS
export const generateOffseasonContractOffers = (
  driver: Driver
): ContractOffer[] => {
  const currentCategory = driver.currentTier;
  const superlicence = driver.superlicencePoints;
  const ovr = driver.overallRating;

  const offers: ContractOffer[] = [];

  if (currentCategory === 'KARTS' || currentCategory === 'FORMULA_4') {
    // Promotion to F3 Offers
    offers.push({
      id: 'off_f3_prema',
      teamId: 'f3_prema',
      category: 'FORMULA_3',
      salaryMillions: 0.3,
      contractYears: 1,
      roleStatus: 'PILOTO_NUMERO_1',
      pitchText: 'PREMA Racing te ofrece el asiento principal en FIA Formula 3. Monoplaza ganador de carreras.',
      requiredSuperlicencePoints: 0,
      offerType: 'ACADEMY_PROMOTION',
    });
    offers.push({
      id: 'off_f3_trident',
      teamId: 'f3_trident',
      category: 'FORMULA_3',
      salaryMillions: 0.2,
      contractYears: 1,
      roleStatus: 'PROSPECTO_JUNIOR',
      pitchText: 'Trident Motorsport te propone 1 año en F3 para desarrollar tu ritmo de clasificación.',
      requiredSuperlicencePoints: 0,
      offerType: 'FACTORY_SEAT',
    });
  } else if (currentCategory === 'FORMULA_3') {
    // Promotion to F2 Offers
    offers.push({
      id: 'off_f2_prema',
      teamId: 'f2_prema',
      category: 'FORMULA_2',
      salaryMillions: 0.8,
      contractYears: 1,
      roleStatus: 'PILOTO_NUMERO_1',
      pitchText: 'PREMA F2 te busca para su alineación titular. Último escalón antes de la Fórmula 1.',
      requiredSuperlicencePoints: 12,
      offerType: 'ACADEMY_PROMOTION',
    });
    offers.push({
      id: 'off_f2_art',
      teamId: 'f2_art',
      category: 'FORMULA_2',
      salaryMillions: 0.6,
      contractYears: 1,
      roleStatus: 'SEGUNDO_PILOTO',
      pitchText: 'ART Grand Prix te ofrece contrato en F2 con acceso a telemetría de vanguardia.',
      requiredSuperlicencePoints: 10,
      offerType: 'FACTORY_SEAT',
    });
  } else {
    // F2 or F1 -> Formula 1 Offers (Requires 40 Superlicence Points!)
    if (superlicence >= 40 || ovr >= 84) {
      offers.push({
        id: 'off_f1_redbull',
        teamId: 'f1_redbull',
        category: 'FORMULA_1',
        salaryMillions: 12.0,
        contractYears: 2,
        roleStatus: 'PILOTO_NUMERO_1',
        pitchText: 'Christian Horner te firma en Red Bull Racing. Monoplaza Campeón del Mundo (Top Tier).',
        requiredSuperlicencePoints: 40,
        offerType: 'FACTORY_SEAT',
      });
      offers.push({
        id: 'off_f1_ferrari',
        teamId: 'f1_ferrari',
        category: 'FORMULA_1',
        salaryMillions: 14.0,
        contractYears: 3,
        roleStatus: 'PILOTO_NUMERO_1',
        pitchText: 'Frédéric Vasseur abre las puertas de Maranello. Conduce la Scuderia Ferrari en F1.',
        requiredSuperlicencePoints: 40,
        offerType: 'FACTORY_SEAT',
      });
    }

    offers.push({
      id: 'off_f1_vcarb',
      teamId: 'f1_vcarb',
      category: 'FORMULA_1',
      salaryMillions: 4.5,
      contractYears: 2,
      roleStatus: 'PROSPECTO_JUNIOR',
      pitchText: 'Visa Cash App RB te ofrece tu debut oficial en la F1 en el equipo de Faenza.',
      requiredSuperlicencePoints: 40,
      offerType: 'ACADEMY_PROMOTION',
    });
    offers.push({
      id: 'off_f1_williams',
      teamId: 'f1_williams',
      category: 'FORMULA_1',
      salaryMillions: 3.8,
      contractYears: 2,
      roleStatus: 'SEGUNDO_PILOTO',
      pitchText: 'James Vowles te propone sumarte al proyecto de reconstrucción de Williams Racing en F1.',
      requiredSuperlicencePoints: 40,
      offerType: 'FACTORY_SEAT',
    });
  }

  return offers;
};
