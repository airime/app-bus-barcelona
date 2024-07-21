import { IBusStopConn } from "./internalInterfaces";


export function toIBusStopConnArray(param:string) {
   return <IBusStopConn[]>JSON.parse(param);
}
  