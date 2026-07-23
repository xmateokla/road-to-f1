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
    qualifyingPace: 65,
    racecraft: 65,
    tireManagement: 65,
    wetWeatherSkill: 65,
    consistency: 65,
    focusUnderPressure: 65,
    fitness: 65,
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

  return Math.min(99, Math.max(55, Math.round(rating)));
};

// SIMULATE A SINGLE GRAND PRIX RACE WEEKEND WITH REALISTIC MOTORSPORT PHYSICS
export const simulateRaceWeekend = (
  driver: Driver,
  team: F1Team,
  track: TrackInfo,
  apexMinigameScore: number | null
): RaceWeekendResult => {
  const driverRating = driver.overallRating;
  const carPerformance = team.carPerformanceIndex;

  // REALISTIC MOTORSPORT PHYSICS: Car Downforce & Engine account for 70%, Driver Skill for 30%
  let combinedPace = (driverRating * 0.30) + (carPerformance * 0.70);

  // Apex Minigame Bonus (-2 to +3 positions impact)
  if (apexMinigameScore !== null) {
    if (apexMinigameScore >= 90) combinedPace += 3;
    else if (apexMinigameScore >= 75) combinedPace += 1.5;
    else combinedPace -= 2.5;
  }

  // Weather Roll
  const isRain = Math.random() < track.rainProbability;
  const weather: RaceWeekendResult['weather'] = isRain 
    ? (Math.random() < 0.3 ? 'TORMENTA_TORRENCIAL' : 'LLUVIA_LIGERA')
    : 'SECO';

  if (weather !== 'SECO') {
    // Wet weather skill allows great drivers to equalize inferior cars in rain!
    const wetBonus = (driver.attributes.wetWeatherSkill - 70) * 0.25;
    combinedPace += wetBonus;
  }

  // DNF Risk
  const dnfRisk = (track.isStreetCircuit ? 0.08 : 0.03) + (driver.attributes.consistency < 65 ? 0.05 : 0);
  const isDnf = Math.random() < dnfRisk;

  // Teammate pace calculation
  const teammatePace = (team.teammateOvr * 0.30) + (carPerformance * 0.70) + (Math.random() * 4 - 2);

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
      teammateGridPosition: Math.min(20, Math.max(1, Math.round(21 - (teammatePace / 5)))),
      teammateFinishPosition: Math.min(20, Math.max(1, Math.round(21 - (teammatePace / 5.2)))),
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

  // Calculate Finish Position (1 to 20) against realistic grid pace
  // TOP TIER teams (96-97 pace) fight for P1-P4; BACKMARKERS (71-74 pace) fight for P14-P20!
  const totalFieldPace = combinedPace + (Math.random() * 8 - 4);
  let finishPos = Math.min(20, Math.max(1, Math.round(21.5 - (totalFieldPace / 4.8))));
  let teammateFinishPos = Math.min(20, Math.max(1, Math.round(21.5 - (teammatePace / 4.8))));

  // F1 Points System (25, 18, 15, 12, 10, 8, 6, 4, 2, 1)
  const f1Points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const pointsScored = finishPos <= 10 ? f1Points[finishPos - 1] : 0;
  const isWin = finishPos === 1;
  const isPodium = finishPos <= 3;
  const isFastestLap = isPodium && Math.random() < 0.25;

  let story = `P3 en la parrilla. Carrera sólida finalizando en P${finishPos}.`;
  if (isWin) story = `🏆 ¡VICTORIA HETEROICA EN ${track.name.toUpperCase()}! Derrotaste a los favoritos de la parrilla.`;
  else if (isPodium) story = `🍾 ¡PODIO GLORIOSO! Subida al cajón tras superar a ${team.teammateName}.`;
  else if (finishPos <= 10) story = `Puntos valiosos para el equipo terminando en P${finishPos}.`;

  return {
    trackName: track.name,
    country: track.country,
    flagUrl: track.flagUrl,
    gridPosition: Math.min(20, Math.max(1, Math.round(finishPos + (Math.random() * 3 - 1.5)))),
    raceFinishPosition: finishPos,
    teammateGridPosition: Math.min(20, Math.max(1, Math.round(teammateFinishPos + (Math.random() * 3 - 1.5)))),
    teammateFinishPosition: teammateFinishPos,
    pointsScored,
    fastestLap: isFastestLap,
    podium: isPodium,
    win: isWin,
    dnf: false,
    weather,
    raceStory: story,
  };
};

// SIMULATE A FULL SEASON (10-22 RACES)
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

  const totalRaces = currentCategory === 'FORMULA_1' ? 22 : currentCategory === 'FORMULA_2' ? 14 : 10;

  let totalPoints = 0;
  let wins = 0;
  let podiums = 0;
  let poles = 0;
  let fastestLaps = 0;
  let teammateH2hWins = 0;
  let teammateH2hPoles = 0;

  // Simulate individual races
  for (let r = 0; r < totalRaces; r++) {
    const track = OFFICIAL_TRACKS[r % OFFICIAL_TRACKS.length];
    const res = simulateRaceWeekend(driver, team, track, null);

    totalPoints += res.pointsScored;
    if (res.win) wins++;
    if (res.podium) podiums++;
    if (res.gridPosition === 1) poles++;
    if (res.fastestLap) fastestLaps++;

    if (res.raceFinishPosition < res.teammateFinishPosition) teammateH2hWins++;
    if (res.gridPosition < res.teammateGridPosition) teammateH2hPoles++;
  }

  // Calculate Realistic Championship Rank based on Team Tier & Performance
  let rank = 14;
  if (team.performanceTier === 'TOP_TIER') {
    rank = totalPoints >= 260 ? 1 : totalPoints >= 200 ? 2 : 3;
  } else if (team.performanceTier === 'UPPER_MIDFIELD') {
    rank = totalPoints >= 200 ? 2 : totalPoints >= 150 ? 4 : 6;
  } else if (team.performanceTier === 'MIDFIELD') {
    rank = totalPoints >= 100 ? 6 : totalPoints >= 60 ? 8 : 10;
  } else {
    rank = totalPoints >= 30 ? 10 : 16; // Backmarker teams fight for P12-P18
  }

  // FIA Official Superlicence Points Allocation
  let superlicenceEarned = 0;
  if (currentCategory === 'FORMULA_2') {
    if (rank === 1) superlicenceEarned = 40; // Champion gets direct F1 eligibility!
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
  if (driver.age <= 21) ovrDelta = rank <= 3 ? 3 : 2;
  else if (driver.age <= 27) ovrDelta = rank <= 3 ? 2 : 1;
  else ovrDelta = -1;

  const newOvr = Math.min(99, Math.max(55, driver.overallRating + ovrDelta));

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
    ? (newOvr >= 92 ? 35.0 : newOvr >= 85 ? 18.0 : 5.0)
    : (currentCategory === 'FORMULA_2' ? 0.8 : 0.2);

  let summaryBadge = 'Temporada Sólida';
  if (rank === 1) summaryBadge = `🏆 CAMPEÓN MUNDIAL DE ${currentCategory}`;
  else if (teammateH2hWins > totalRaces / 2) summaryBadge = `⚔️ Dominio H2H sobre ${team.teammateName}`;

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
    teammateH2hWins,
    teammateH2hPoles,
    superlicencePointsEarned: superlicenceEarned,
    earnedSalaryMillions: salaryBase,
    summaryBadge,
    seasonNarrative: rank === 1 
      ? `¡TEMPORADA CONSAGRATORIA! Te coronas Campeón de ${currentCategory} tras dominar el campeonato.`
      : `Finalizas P${rank} en el campeonato con ${totalPoints} PTS. Duelo de equipo: ${teammateH2hWins}/${totalRaces} victorias contra ${team.teammateName}.`,
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

// GENERATE SILLY SEASON CONTRACT OFFERS WITH TEAMMATE H2H AND ACADEMY DEMANDS
export const generateOffseasonContractOffers = (
  driver: Driver
): ContractOffer[] => {
  const currentCategory = driver.currentTier;
  const superlicence = driver.superlicencePoints;
  const ovr = driver.overallRating;

  const offers: ContractOffer[] = [];

  if (currentCategory === 'KARTS' || currentCategory === 'FORMULA_4') {
    offers.push({
      id: 'off_f3_prema',
      teamId: 'f3_prema',
      category: 'FORMULA_3',
      salaryMillions: 0.3,
      contractYears: 1,
      roleStatus: 'PILOTO_NUMERO_1',
      pitchText: 'PREMA Racing te ofrece el asiento en FIA F3. Monoplaza de 80 OVR para luchar arriba.',
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
    offers.push({
      id: 'off_f2_prema',
      teamId: 'f2_prema',
      category: 'FORMULA_2',
      salaryMillions: 0.8,
      contractYears: 1,
      roleStatus: 'PILOTO_NUMERO_1',
      pitchText: 'PREMA F2 te busca para su alineación titular. Penúltimo escalón antes de la F1.',
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
  } else if (currentCategory === 'FORMULA_2') {
    // Offer F2 renewals
    offers.push({
      id: 'off_f2_renew_prema',
      teamId: 'f2_prema',
      category: 'FORMULA_2',
      salaryMillions: 1.0,
      contractYears: 1,
      roleStatus: 'PILOTO_NUMERO_1',
      pitchText: 'Renovación en PREMA F2 para asegurar los Puntos de Superlicencia restantes antes del salto a F1.',
      requiredSuperlicencePoints: 0,
      offerType: 'FACTORY_SEAT',
    });
    offers.push({
      id: 'off_f2_renew_art',
      teamId: 'f2_art',
      category: 'FORMULA_2',
      salaryMillions: 0.8,
      contractYears: 1,
      roleStatus: 'PILOTO_NUMERO_1',
      pitchText: 'ART Grand Prix te mantiene en F2 con contrato preferencial.',
      requiredSuperlicencePoints: 0,
      offerType: 'ACADEMY_PROMOTION',
    });

    // F1 Offers (Requires 40 Superlicence Points!)
    if (superlicence >= 40 || ovr >= 84) {
      offers.push({
        id: 'off_f1_vcarb',
        teamId: 'f1_vcarb',
        category: 'FORMULA_1',
        salaryMillions: 4.5,
        contractYears: 2,
        roleStatus: 'PROSPECTO_JUNIOR',
        pitchText: 'Visa Cash App RB te da el debut en F1. Formarás dupla con Yuki Tsunoda.',
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
        pitchText: 'James Vowles te propone sumarte al proyecto Williams Racing en F1 junto a Alex Albon.',
        requiredSuperlicencePoints: 40,
        offerType: 'FACTORY_SEAT',
      });
      if (ovr >= 88) {
        offers.push({
          id: 'off_f1_redbull',
          teamId: 'f1_redbull',
          category: 'FORMULA_1',
          salaryMillions: 15.0,
          contractYears: 2,
          roleStatus: 'PILOTO_NUMERO_1',
          pitchText: 'Christian Horner te firma en Red Bull Racing. Serás compañero de Max Verstappen.',
          requiredSuperlicencePoints: 40,
          offerType: 'FACTORY_SEAT',
        });
      }
    }
  } else {
    // Formula 1 Drivers Offers
    offers.push({
      id: 'off_f1_redbull_renew',
      teamId: 'f1_redbull',
      category: 'FORMULA_1',
      salaryMillions: 25.0,
      contractYears: 3,
      roleStatus: 'PILOTO_NUMERO_1',
      pitchText: 'Red Bull Racing te mantiene como líder con $25M USD/Año para batir a Verstappen.',
      requiredSuperlicencePoints: 40,
      offerType: 'FACTORY_SEAT',
    });
    offers.push({
      id: 'off_f1_ferrari_renew',
      teamId: 'f1_ferrari',
      category: 'FORMULA_1',
      salaryMillions: 28.0,
      contractYears: 3,
      roleStatus: 'PILOTO_NUMERO_1',
      pitchText: 'Scuderia Ferrari abre las puertas de Maranello con Charles Leclerc de compañero.',
      requiredSuperlicencePoints: 40,
      offerType: 'FACTORY_SEAT',
    });
    offers.push({
      id: 'off_f1_mclaren_renew',
      teamId: 'f1_mclaren',
      category: 'FORMULA_1',
      salaryMillions: 22.0,
      contractYears: 2,
      roleStatus: 'PILOTO_NUMERO_1',
      pitchText: 'Andrea Stella te ofrece el monoplaza de Woking para competir junto a Lando Norris.',
      requiredSuperlicencePoints: 40,
      offerType: 'FACTORY_SEAT',
    });
  }

  return offers;
};
