import { TupleCoordinates } from "./internalTuples";

type IdOperador = 1 | 2 | 3 | 4 | 5;
// ORDENAT PEL ID_OPERADOR [1, 2, 3, 4, 5]
export const OperadorValues = ["Metro", "TB", "FGC", "TRAM", "Rodalies"] as const;
export type Operador = (typeof OperadorValues)[number];

/* CODI_FAMILIA */
type CodiFamiliaBus = 1 | 3 | 4 | 5 | 6 | 7 | 9 | 10 | 11;
export const NomFamiliaBusValues = ["Convencionals", "Proximitat", "BusTuristic",
                   "Diagonals", "Horitzontals", "Verticals",
                   "Llançadores", "Bus a la Demanda", "XPRESBus"] as const;

export type NomFamiliaBus = (typeof NomFamiliaBusValues)[number];

/* Sembla que ID_FAMILIA no es fa servir */
/* EQUIVALENCIA FAMILIES BUS (CODI_FAMILIA -> ID_FAMILIA)
    1 -> 3
    3 -> 5
    4 -> 6
    5 -> 7
    6 -> 8
    7 -> 9
    9 -> 24
    10 -> 25
    11 -> 26
*/

export type CodiFamiliaMetro = 1 | 2;
export type NomFamiliaMetro = "Metro" | "Metro-Funicular";

export type CodiFamilia = CodiFamiliaBus | CodiFamiliaMetro;
export type NomFamilia = NomFamiliaBus | NomFamiliaMetro;

export interface IRouteNumber {
  ID_OPERADOR: IdOperador;
  NOM_OPERADOR: Operador;
  CODI_FAMILIA: CodiFamilia;
  NOM_FAMILIA: NomFamilia;
  CODI_LINIA: number;
  NOM_LINIA: string;
  DESC_LINIA: string;
  ORIGEN_LINIA: string;
  DESTI_LINIA: string;
  COLOR_LINIA: string;
}

export interface IStopInfo {
  CODI_PARADA: number;
  NOM_PARADA: string;
  GEOMETRY: TupleCoordinates;
  CODI_INTERC?: number;
  NOM_INTERC?: string | null;
  LINIES?: IBusStopConn[];
  CONNEXIONS?: IStopInfo[];
}

export interface IBusStopConn {
  ID_OPERADOR: IdOperador;
  NOM_OPERADOR: Operador;
  CODI_FAMILIA: CodiFamilia;
  NOM_FAMILIA: NomFamilia;
  CODI_LINIA: number;
  NOM_LINIA: string;
  DESC_LINIA: string;
  DESTI_LINIA: string;
  COLOR_LINIA: string;
}

export interface IInterconnConn extends IBusStopConn {
  GEOMETRY: TupleCoordinates;
}


export function RouteAdditionalInfo(linia: IBusStopConn) {
  return '(' + linia.DESTI_LINIA + ')';
}


export function sortRouteFamilies(a: IBusStopConn, b: IBusStopConn) {
  const op1 = a.ID_OPERADOR;
  const op2 = b.ID_OPERADOR;
  if (op1 == op2 ) {
    const f1 = a.CODI_FAMILIA;
    const f2 = b.CODI_FAMILIA;
    if (op1 == 2) /* 'TB' */ {
      if (f1 == f2)
        return a.CODI_LINIA > b.CODI_LINIA ? 1 : -1;
      else {
        const ordreFamilies = [1,5,6,7,3,4,9,10,11];
        let of1 = ordreFamilies.findIndex(v => (v == f1));
        let of2 = ordreFamilies.findIndex(v => (v == f2));
        return of1 > of2 ? 1 : -1;
      }
    }
    else return f1 > f2 ? 1 : -1;
  } 
  else {
    const ordreOperadors = [2,4,1,3,5];
    let o1 = ordreOperadors[op1-1];
    let o2 = ordreOperadors[op2-1];
    return o1 > o2 ? 1 : -1;
  }
}
