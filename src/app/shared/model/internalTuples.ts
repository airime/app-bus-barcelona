import { IStopInfo, IBusStopConn } from "./internalInterfaces";

/* COMPTE! Primer lng, seguit de lat */
/* TupleCoordinates [lng, lat] */
export type TupleCoordinates = [number, number];

/* TupleLinia = [NOM_LINIA, CODI_LINIA, ORIGEN_LINIA, DESTI_LINIA, NOM_FAMILIA] */
export type TupleLinia = [string, number, string, string, string];

/* OWN SERVICES FUNCTIONS RETURN TYPES */
export type TwoWayStops = { outwardBusStops: IStopInfo[], returnBusStops: IStopInfo[] };
export type OperatorLines = {
    liniesTram: IBusStopConn[],
    liniesBus: IBusStopConn[],
    liniesMetro: IBusStopConn[],
    liniesFGC: IBusStopConn[],
    liniesRodalies: IBusStopConn[] 
}

export function LatLngFromTupla(tupla: TupleCoordinates): google.maps.LatLngLiteral {
    return { lat: tupla[1], lng: tupla[0] }
}
