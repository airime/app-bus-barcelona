export interface IStop {
  CODI_PARADA: number;
  NOM_PARADA: string;
  posicio: google.maps.LatLngLiteral;
  linies?: string[];
}

export interface IStopResponse {
  status: string,
  data: {ibus: IBus[]}
}

export interface IBus {
  destination: string,
  line: string,
  'text-ca': string
}
