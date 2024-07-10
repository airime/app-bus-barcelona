export interface Stop {
  CODI_PARADA: number;
  NOM_PARADA: string;
  posicio: google.maps.LatLngLiteral;
  linies?: string[];
}

export interface StopResponse {
  status: string,
  data: {ibus: Bus[]}
}

export interface Bus {
  destination: string,
  line: string,
  'text-ca': string
}
