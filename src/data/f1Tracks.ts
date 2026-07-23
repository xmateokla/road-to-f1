export interface TrackInfo {
  id: string;
  name: string;
  location: string;
  country: string;
  flagUrl: string;
  lengthKm: number;
  cornersCount: number;
  drsZonesCount: number;
  tireWearSeverity: 'BAJA' | 'MEDIA' | 'ALTA' | 'EXTREMA';
  rainProbability: number; // 0.0 to 1.0
  isStreetCircuit: boolean;
  keyChallenge: string;
  icon: string;
}

export const OFFICIAL_TRACKS: TrackInfo[] = [
  {
    id: 'monaco',
    name: 'Circuit de Monaco',
    location: 'Montecarlo',
    country: 'Mónaco',
    flagUrl: 'https://flagcdn.com/w40/mc.png',
    lengthKm: 3.337,
    cornersCount: 19,
    drsZonesCount: 1,
    tireWearSeverity: 'BAJA',
    rainProbability: 0.25,
    isStreetCircuit: true,
    keyChallenge: 'Cero margen de error. La clasificación a 1 vuelta decide el 90% de la carrera.',
    icon: '🇲🇨',
  },
  {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    location: 'Northamptonshire',
    country: 'Reino Unido',
    flagUrl: 'https://flagcdn.com/w40/gb.png',
    lengthKm: 5.891,
    cornersCount: 18,
    drsZonesCount: 2,
    tireWearSeverity: 'EXTREMA',
    rainProbability: 0.45,
    isStreetCircuit: false,
    keyChallenge: 'Curvas de altísima velocidad (Maggotts & Becketts). Desgaste brutal en el neumático delantero izquierdo.',
    icon: '🇬🇧',
  },
  {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    location: 'Stavelot',
    country: 'Bélgica',
    flagUrl: 'https://flagcdn.com/w40/be.png',
    lengthKm: 7.004,
    cornersCount: 19,
    drsZonesCount: 2,
    tireWearSeverity: 'ALTA',
    rainProbability: 0.60,
    isStreetCircuit: false,
    keyChallenge: 'Subida a Eau Rouge / Raidillon. Clima impredecible donde llueve en un sector y en otro está seco.',
    icon: '🇧🇪',
  },
  {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    location: 'Monza',
    country: 'Italia',
    flagUrl: 'https://flagcdn.com/w40/it.png',
    lengthKm: 5.793,
    cornersCount: 11,
    drsZonesCount: 2,
    tireWearSeverity: 'MEDIA',
    rainProbability: 0.20,
    isStreetCircuit: false,
    keyChallenge: 'El Templo de la Velocidad. Alerones planos de mínima carga aerodinámica y frenadas salvajes en las Chicanes.',
    icon: '🇮🇹',
  },
  {
    id: 'suzuka',
    name: 'Suzuka International Racing Course',
    location: 'Mie',
    country: 'Japón',
    flagUrl: 'https://flagcdn.com/w40/jp.png',
    lengthKm: 5.807,
    cornersCount: 18,
    drsZonesCount: 1,
    tireWearSeverity: 'EXTREMA',
    rainProbability: 0.35,
    isStreetCircuit: false,
    keyChallenge: 'Trazado en forma de 8 con las Ese iniciales. Exige precisión rítmica absoluta.',
    icon: '🇯🇵',
  },
  {
    id: 'interlagos',
    name: 'Autódromo José Carlos Pace (Interlagos)',
    location: 'São Paulo',
    country: 'Brasil',
    flagUrl: 'https://flagcdn.com/w40/br.png',
    lengthKm: 4.309,
    cornersCount: 15,
    drsZonesCount: 2,
    tireWearSeverity: 'ALTA',
    rainProbability: 0.55,
    isStreetCircuit: false,
    keyChallenge: 'Sentido antihorario con tormentas tropicales repentinas. S de Senna icónica.',
    icon: '🇧🇷',
  },
];
