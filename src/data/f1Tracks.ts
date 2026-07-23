export interface TrackInfo {
  id: string;
  name: string;
  country: string;
  city: string;
  flagUrl: string;
  circuitMapUrl: string;
  lengthKm: number;
  turnsCount: number;
  lapsCount: number;
  rainProbability: number;
  isStreetCircuit: boolean;
  drsZonesCount: number;
  lapRecordTime: string;
  lapRecordHolder: string;
}

export const OFFICIAL_TRACKS: TrackInfo[] = [
  {
    id: 'monaco',
    name: 'Circuit de Monaco',
    country: 'Mónaco',
    city: 'Monte Carlo',
    flagUrl: 'https://flagcdn.com/w40/mc.png',
    circuitMapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Circuit_Monaco.svg/800px-Circuit_Monaco.svg.png',
    lengthKm: 3.337,
    turnsCount: 19,
    lapsCount: 78,
    rainProbability: 0.25,
    isStreetCircuit: true,
    drsZonesCount: 1,
    lapRecordTime: '1:12.909',
    lapRecordHolder: 'Lewis Hamilton',
  },
  {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    country: 'Reino Unido',
    city: 'Silverstone',
    flagUrl: 'https://flagcdn.com/w40/gb.png',
    circuitMapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Silverstone_Circuit_2011.svg/800px-Silverstone_Circuit_2011.svg.png',
    lengthKm: 5.891,
    turnsCount: 18,
    lapsCount: 52,
    rainProbability: 0.40,
    isStreetCircuit: false,
    drsZonesCount: 2,
    lapRecordTime: '1:27.097',
    lapRecordHolder: 'Max Verstappen',
  },
  {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    country: 'Bélgica',
    city: 'Stavelot',
    flagUrl: 'https://flagcdn.com/w40/be.png',
    circuitMapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Spa-Francorchamps_of_Belgium.svg/800px-Spa-Francorchamps_of_Belgium.svg.png',
    lengthKm: 7.004,
    turnsCount: 19,
    lapsCount: 44,
    rainProbability: 0.55,
    isStreetCircuit: false,
    drsZonesCount: 2,
    lapRecordTime: '1:46.286',
    lapRecordHolder: 'Valtteri Bottas',
  },
  {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    country: 'Italia',
    city: 'Monza',
    flagUrl: 'https://flagcdn.com/w40/it.png',
    circuitMapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Autodromo_Nazionale_Monza_%282000%29.svg/800px-Autodromo_Nazionale_Monza_%282000%29.svg.png',
    lengthKm: 5.793,
    turnsCount: 11,
    lapsCount: 53,
    rainProbability: 0.20,
    isStreetCircuit: false,
    drsZonesCount: 2,
    lapRecordTime: '1:21.046',
    lapRecordHolder: 'Rubens Barrichello',
  },
  {
    id: 'suzuka',
    name: 'Suzuka International Racing Course',
    country: 'Japón',
    city: 'Suzuka',
    flagUrl: 'https://flagcdn.com/w40/jp.png',
    circuitMapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Suzuka_circuit_map_2005.svg/800px-Suzuka_circuit_map_2005.svg.png',
    lengthKm: 5.807,
    turnsCount: 18,
    lapsCount: 53,
    rainProbability: 0.35,
    isStreetCircuit: false,
    drsZonesCount: 1,
    lapRecordTime: '1:30.983',
    lapRecordHolder: 'Lewis Hamilton',
  },
  {
    id: 'interlagos',
    name: 'Autódromo José Carlos Pace (Interlagos)',
    country: 'Brasil',
    city: 'São Paulo',
    flagUrl: 'https://flagcdn.com/w40/br.png',
    circuitMapUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace_%28Interlagos%29_circuit_map.svg/800px-Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace_%28Interlagos%29_circuit_map.svg.png',
    lengthKm: 4.309,
    turnsCount: 15,
    lapsCount: 71,
    rainProbability: 0.50,
    isStreetCircuit: false,
    drsZonesCount: 2,
    lapRecordTime: '1:10.540',
    lapRecordHolder: 'Valtteri Bottas',
  },
];
