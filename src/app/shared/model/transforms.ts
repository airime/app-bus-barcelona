import { INamedPlace } from "../interfaces/INamedPlace";
import { IBusStopConn } from "./internalInterfaces";


export function toIBusStopConnArray(param:string): IBusStopConn[] {
   return <IBusStopConn[]>JSON.parse(param);
}

export function toINamedPlace(param: string): INamedPlace {
   return <INamedPlace>JSON.parse(param);
}

export function toLatLng(param: string): google.maps.LatLngLiteral {
   return <google.maps.LatLngLiteral>JSON.parse(param);
}