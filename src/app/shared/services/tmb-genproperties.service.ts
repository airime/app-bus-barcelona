import { Injectable } from '@angular/core';
import { TmbService } from './tmb.service';
import { IRouteNumber, IStopInfo, IBusStopConn, IInterconnConn, sortRouteFamilies, IDirectionalStopInfo } from '../model/internalInterfaces';
import { TupleLinia, TwoWayStops, OperatorLines, TwoWayTimeTable } from '../model/internalTuples';
import { IDirectionalTimeTable } from '../model/ibusStop';

@Injectable({
  providedIn: 'root'
})
export class TmbGenpropertiesService {

  constructor(private tmbService: TmbService) { }

  /**********************************************/
  /***  procedure to build our static data   ***/

  /* data is built using another program, and stored in a JSON file */
  /* for the static data see StaticDataService */

  public askTMB() {
    return new Promise<IStopInfo[]>(resolve => {
      this.tmbService.getBusStops().subscribe((value: any) => {
        let parades = <IStopInfo[]>this.properties(value, { excludeKeys: ["ID_PARADA"] });
        console.log(parades);
        parades.forEach(parada  => {
          this.tmbService.getBusStopConn(parada.CODI_PARADA).subscribe((linies: any) => {
            let objValue = <IBusStopConn[]>this.properties(linies);
            Object.defineProperty(parada, 'LINIES', { value: objValue, enumerable: true });
          });
          if (!!parada.CODI_INTERC && parada.CODI_INTERC > 0) {
            this.tmbService.getInterconnBusStops(parada.CODI_INTERC).subscribe((paradesInterc: any) => {
              let objValue = <IStopInfo[]>this.properties(paradesInterc);
              Object.defineProperty(parada, 'CONNEXIONS', { value: objValue, enumerable: true });
            });
          } else {
            delete parada.CODI_INTERC;
            delete parada.NOM_INTERC;
          }
        });
        resolve(parades);
      });
    });
  }

  /**********************************************/
  /***   INTERACTIVE FUNCTIONALITY: HORARIS   ***/
  
  public async getRouteTimetable(codiLinia: number): Promise<TwoWayTimeTable>
  {
    return new Promise<TwoWayTimeTable>(resolve => {
      this.tmbService.getBusRouteStops(codiLinia).subscribe((result: any) => {
        let stops = <IDirectionalTimeTable[]>this.properties(result);

        // anada
        let outwardTimeTable = stops.filter(function (stop: IDirectionalTimeTable) {    // Filter by direction
          return stop.SENTIT == "A";
        });

        // tornada: Same for the opposite direction
        let returnTimeTable = stops.filter(function (stop: IDirectionalTimeTable) {    // Filter by direction
          return stop.SENTIT == "T";
        });
        resolve({ outwardTimeTable, returnTimeTable });
      });
    });
  }

  /*************************************/
  /***   INTERACTIVE FUNCTIONALITY   ***/

  // Línies d'autobús en una tupla
  public async getRouteNumbers(): Promise<TupleLinia[]> {
    return new Promise<TupleLinia[]>(resolve => {
      this.tmbService.getRouteNumbers().subscribe((value: any) => {
        let lines = <IRouteNumber[]>this.properties(value);
        lines.sort(sortRouteFamilies);
        const result: TupleLinia[] = [];
        lines.forEach(function (line: any) {
          result.push([line.NOM_LINIA + ' - ' + line.DESC_LINIA,
                       line.CODI_LINIA,
                       line.ORIGEN_LINIA,
                       line.DESTI_LINIA,
                       line.NOM_FAMILIA]);
        });
        resolve(result);
      });
    });
  }

  public async getOneRouteNumber(codiLinia: number): Promise<TupleLinia[]> {
    return new Promise<TupleLinia[]>(resolve => {
      this.tmbService.getRouteNumbers(codiLinia).subscribe((value: any) => {
        let linia = <IRouteNumber>this.properties(value)[0];
        const result: TupleLinia[] = [];
        result.push([linia.NOM_LINIA + ' - ' + linia.DESC_LINIA,
                     linia.CODI_LINIA,
                     linia.ORIGEN_LINIA,
                     linia.DESTI_LINIA,
                     linia.NOM_FAMILIA]);
        resolve(result);
      });
    });
  }
  
  public async getBusRouteStops(codiLinia: number): Promise<TwoWayStops>
  {
    return new Promise<TwoWayStops>(resolve => {
      this.tmbService.getBusRouteStops(codiLinia).subscribe((result: any) => {
        let stops = <IDirectionalStopInfo[]>this.properties(result);

        // anada
        let outwardBusStops = stops.filter(function (stop: IDirectionalStopInfo) {    // Filter by direction
          return stop.SENTIT == "A";
        }).sort(function (stop1: IDirectionalStopInfo, stop2: IDirectionalStopInfo) { // Order
          return stop1.ORDRE - stop2.ORDRE;
        });

        // tornada: Same for the opposite direction
        let returnBusStops = stops.filter(function (stop: IDirectionalStopInfo) {    // Filter by direction
          return stop.SENTIT == "T";
        }).sort(function (stop1: IDirectionalStopInfo, stop2: IDirectionalStopInfo) { // Order
          return stop1.ORDRE - stop2.ORDRE;
        });
        resolve({ outwardBusStops, returnBusStops });
      });
    });
  }

  public async getBusStopConnPlain(codiParada: number): Promise<IBusStopConn[]> {
    return new Promise<IBusStopConn[]>( resolve => {
      this.tmbService.getBusStopConn(codiParada).subscribe((linies: any) => {
        resolve(<IBusStopConn[]>this.properties(linies));
      });
    });
  }

  /* get OperatorLines */
  public async getBusStopConn(codiParada: number): Promise<OperatorLines> {
    return new Promise<OperatorLines>( resolve => {
      this.tmbService.getBusStopConn(codiParada).subscribe(async (linies: any) => {
        resolve(this.breakUpConnectionsByOperator(<IBusStopConn[]>this.properties(linies)));
      });
    });
  }

  public async getBusRouteStopConnPlain(codiLinia: number, codiParada: number): Promise<IBusStopConn[]> {
    return new Promise<IBusStopConn[]>( resolve => {
      this.tmbService.getBusRouteStopConn(codiLinia, codiParada).subscribe(async (result: any) => {
        resolve(<IBusStopConn[]>this.properties(result));
      });
    });
  }

  /* get OperatorLines */
  public async getBusRouteStopConn(codiLinia: number, codiParada: number): Promise<OperatorLines> {
      return new Promise<OperatorLines>(resolve => {
        this.tmbService.getBusRouteStopConn(codiLinia, codiParada).subscribe(async (result: any) => {
          resolve(this.breakUpConnectionsByOperator(<IBusStopConn[]>this.properties(result)));
        });        
      })
  }

  public async getBusInterconnConnPlain(codiIntercanvi: number): Promise<IInterconnConn[]> {
    return new Promise<IInterconnConn[]>( resolve => {
      this.tmbService.getBusInterconnConn(codiIntercanvi).subscribe(async (result: any) => {
        resolve(<IInterconnConn[]>this.properties(result));
      });
    });
  }

  /* TODO Sembla que no cal, només retorna bus */
  /* get OperatorLines */
  public async getBusInterconnConn(codiIntercanvi: number): Promise<OperatorLines> {
    return new Promise<OperatorLines>( resolve => {
      this.tmbService.getBusInterconnConn(codiIntercanvi).subscribe(async (result: any) => {
        resolve(this.breakUpConnectionsByOperator(<IInterconnConn[]>this.properties(result)));
      });
    });
  }

  // Converts a GeoJSON FeatureCollection structure into a "flat" array of object properties.
  // Geometries are discarded.
  private properties(featureCollection: any, options?: { excludeKeys?: string[] }) {
    const excludeKeys = options?.excludeKeys;
    const properties: any = [];
    featureCollection.features.forEach(function (feature: any) {
      const itemProperties = feature.properties;
      if (!!feature.geometry?.coordinates) {
        Object.defineProperty(itemProperties, 'GEOMETRY', { value: feature.geometry.coordinates, enumerable: true });
      }
      if (!!excludeKeys) {
        Object.keys(itemProperties).forEach((key) => {
          if (excludeKeys.includes(key)) {
            delete itemProperties[key as keyof typeof itemProperties];
          }
        });
      }
      properties.push(itemProperties);
    });
    return properties;
  }


  private breakUpConnectionsByOperator<T extends IBusStopConn>(linies: T[]):
   { liniesTram: T[], liniesBus: T[], liniesMetro: T[], liniesFGC: T[], liniesRodalies: T[]} {

    const removeBusStopConnDups = (arr: T[]): T[] => {
      let unique: T[] = [];
      for (let i = 0; i < arr.length; i++) {
        if (unique.findIndex((x) => x.CODI_LINIA == arr[i].CODI_LINIA) === -1) {
          unique.push(arr[i]);
        }
      }
      return unique;
    }    
    
    let liniesFiltered: T[];
    liniesFiltered = linies.filter(function (linia: T) { return linia.NOM_OPERADOR == "TRAM" });
    let liniesTram = removeBusStopConnDups(liniesFiltered);
    liniesFiltered = linies.filter(function (linia: T) { return linia.NOM_OPERADOR == "TB" });         
    let liniesBus = removeBusStopConnDups(liniesFiltered);
    liniesFiltered = linies.filter(function (linia: T) { return linia.NOM_OPERADOR == "Metro" });
    let liniesMetro = removeBusStopConnDups(liniesFiltered);
    liniesFiltered = linies.filter(function (linia: T) { return linia.NOM_OPERADOR == "FGC" });
    let liniesFGC = removeBusStopConnDups(liniesFiltered);
    liniesFiltered = linies.filter(function (linia: T) { return linia.NOM_OPERADOR == "Rodalies" });
    let liniesRodalies = removeBusStopConnDups(liniesFiltered);
    return { liniesTram, liniesBus, liniesMetro, liniesFGC, liniesRodalies }
  }

}

