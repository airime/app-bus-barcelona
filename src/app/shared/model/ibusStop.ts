import { Sentit } from "./internalInterfaces"

export interface IiBusResponse<T> {
  status: string,
  data: {ibus: T[]}
}

export interface IiBusRouteStop {
  destination: string,
  'text-ca': string
}

export interface IiBusStop extends IiBusRouteStop {
  line: string,
}

export interface ITimeTable {
  "ID_TIPUS_DIA": number;
  "SENTIT": Sentit;
  "DESC_LINIA": string;
  "DESC_TIPUS_DIA": string;
  "DESC_SENTIT": string;
  "PRIMERA_SORTIDA": string;
  "ULTIMA_SORTIDA": string;
}

export interface IDirectionalTimeTable extends ITimeTable {
  "SENTIT": Sentit;
}