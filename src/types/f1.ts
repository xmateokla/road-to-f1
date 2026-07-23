export type CategoryTier = 'KARTS' | 'FORMULA_4' | 'FORMULA_3' | 'FORMULA_2' | 'FORMULA_1';

export type JuniorAcademyId = 
  | 'red_bull' 
  | 'ferrari' 
  | 'mercedes' 
  | 'mclaren' 
  | 'alpine' 
  | 'privateer';

export type TeamPerformanceTier = 'TOP_TIER' | 'UPPER_MIDFIELD' | 'MIDFIELD' | 'BACKMARKER';

export interface DriverAttributes {
  qualifyingPace: number;     // 1-lap speed
  racecraft: number;          // Wheel-to-wheel overtaking & defense
  tireManagement: number;     // Preserving rubber over stint
  wetWeatherSkill: number;    // Reflexes & car control in rain
  consistency: number;        // Avoiding lockups, errors & track limits
  focusUnderPressure: number; // Safety car restarts & pit entry
  fitness: number;            // G-force stamina
}

export interface F1Team {
  id: string;
  name: string;
  fullName: string;
  category: CategoryTier;
  performanceTier: TeamPerformanceTier;
  carPerformanceIndex: number; // 60 (Backmarker) to 98 (Top Tier)
  pitStopSpeedRating: number;  // Pitstop efficiency (1.9s vs 3.5s)
  aerodynamicsIndex: number;
  enginePowerIndex: number;
  teamPrincipal: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  chassisName: string;
  engineSupplier: string;
  description: string;
  academyAffiliation?: JuniorAcademyId;
}

export interface JuniorAcademy {
  id: JuniorAcademyId;
  name: string;
  badge: string;
  logoUrl: string;
  primaryColor: string;
  scoutBonusText: string;
  description: string;
  pressureLevel: 'EXTREMO' | 'ALTO' | 'MODERADO';
  attributeBoosts: Partial<DriverAttributes>;
}

export interface SuperlicenceStats {
  points: number;              // Target: 40 points in 3 years for F1
  yearsActive: number;
  unlockedF1Eligibility: boolean;
}

export interface RaceWeekendResult {
  trackName: string;
  country: string;
  flagUrl: string;
  gridPosition: number;
  raceFinishPosition: number;
  pointsScored: number;
  fastestLap: boolean;
  podium: boolean;
  win: boolean;
  dnf: boolean;
  dnfReason?: string;
  weather: 'SECO' | 'LLUVIA_LIGERA' | 'TORMENTA_TORRENCIAL';
  raceStory: string;
}

export interface SeasonSummary {
  year: number;
  age: number;
  category: CategoryTier;
  teamId: string;
  teamName: string;
  racesPlayed: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  championshipPoints: number;
  championshipRank: number; // 1st = Champion, 2nd, etc.
  superlicencePointsEarned: number;
  earnedSalaryMillions: number;
  summaryBadge: string;
  seasonNarrative: string;
}

export interface ContractOffer {
  id: string;
  teamId: string;
  category: CategoryTier;
  salaryMillions: number;
  contractYears: number;
  roleStatus: 'PILOTO_NUMERO_1' | 'SEGUNDO_PILOTO' | 'PROSPECTO_JUNIOR';
  pitchText: string;
  requiredSuperlicencePoints: number;
  offerType: 'FACTORY_SEAT' | 'ACADEMY_PROMOTION' | 'PAY_DRIVER_SEAT';
}

export interface LifestyleInvestment {
  id: string;
  name: string;
  category: 'performance' | 'lifestyle' | 'business';
  tier: 1 | 2 | 3;
  costMillions: number;
  annualIncomeMillions: number;
  reputationBonus: number;
  attributeBoosts?: Partial<DriverAttributes>;
  icon: string;
  bought: boolean;
}

export interface Driver {
  id: string;
  name: string;
  country: string;
  flagUrl: string;
  racingNumber: number;
  helmetColor: string;
  age: number;
  currentTier: CategoryTier;
  juniorAcademyId: JuniorAcademyId;
  overallRating: number;
  reputation: number;
  marketability: number;
  earningsMillions: number;
  passiveIncomeMillions: number;
  attributes: DriverAttributes;
  currentTeamId: string;
  superlicencePoints: number;
  unlockedBadges: string[];
  investments: LifestyleInvestment[];
  contractYearsRemaining: number;
  contractSalaryMillions: number;
}
