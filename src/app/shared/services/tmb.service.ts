import { Injectable } from '@angular/core';
import { urlTmbApi, TmbParamsType, ITmbPlanParams } from '../model/tmbParams';
import { IiBusStop, IiBusResponse, IiBusRouteStop } from '../model/ibusStop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tmb_api_id, tmb_api_key } from 'src/app/api.key';
import { formatAMPM, isDefined } from '../util/util';

@Injectable({
  providedIn: 'root'
})
export class TmbService {

  /***************************************************************************/
  /* used only for construction of personalized fixed data (not needed here) */
  private readonly propertiesBusStops = "GEOMETRY,CODI_PARADA,NOM_PARADA,CODI_INTERC,NOM_INTERC";
  /* also propertiesBusStopConn is used in the construction of personalized fixed data, and available there */
  // parades d'autobús d'un intercanvi
  private readonly propertiesInterconnBusStops = "GEOMETRY,CODI_PARADA,NOM_PARADA";

  /******************************/
  /* interactive timetable call */
  private readonly propertiesRouteTimeTable = "ID_TIPUS_DIA,SENTIT,DESC_LINIA,DESC_TIPUS_DIA,DESC_SENTIT,PRIMERA_SORTIDA,ULTIMA_SORTIDA"

  /*********************/
  /* interactive calls */
  private readonly propertiesRouteNumbers = "ID_OPERADOR,NOM_OPERADOR,CODI_FAMILIA,NOM_FAMILIA,CODI_LINIA,NOM_LINIA,DESC_LINIA,ORIGEN_LINIA,DESTI_LINIA,COLOR_LINIA";
  private readonly propertiesBusRouteStops = "GEOMETRY,SENTIT,ORDRE,CODI_PARADA,NOM_PARADA,CODI_INTERC,NOM_INTERC";
  private readonly propertiesBusStopConn = "ID_OPERADOR,NOM_OPERADOR,CODI_FAMILIA,NOM_FAMILIA,CODI_LINIA,NOM_LINIA,DESC_LINIA,DESTI_LINIA,COLOR_LINIA";
  //Linies disponibles en un intercanvi (inclou tots els operadors)
  private readonly propertiesInterconnConn = "ID_OPERADOR,NOM_OPERADOR,CODI_FAMILIA,NOM_FAMILIA,CODI_LINIA,NOM_LINIA,DESC_LINIA,DESTI_LINIA,COLOR_LINIA,GEOMETRY";

  private readonly tmbParams: TmbParamsType = {
    app_key: tmb_api_key,
    app_id: tmb_api_id,
  }

  private getParams(properties: string): TmbParamsType {
    return {
      app_key: tmb_api_key,
      app_id: tmb_api_id,
      propertyName: properties
    }
  }

  constructor(private http: HttpClient) { }

  /*
  public get(url: string, options?: any) {
    return this.http.get(url, options);
    }
    public post(url: string, data: any, options?: any) {
    return this.http.post(url, data, options);
    }
    public put(url: string, data: any, options?: any) {
    return this.http.put(url, data, options);
    }
    public delete(url: string, options?: any) {
    return this.http.delete(url, options);
    }
  */

  /****************************************************/
  /* used for construction of personalized static data */

  public getBusStops(): Observable<any> {
    const request = "transit/parades";
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesBusStops));
    return this.http.get(url);
  }

  public getBusStopConn(codiParada: number): Observable<any> {
    const request = `transit/parades/${codiParada}/corresp`;
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesBusStopConn));
    return this.http.get(url);
  }

  public getInterconnBusStops(codiIntercanvi: number): Observable<any> {
    const request = `transit/interc/${codiIntercanvi}/parades`;
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesInterconnBusStops));
    return this.http.get(url);
  }

  /**************************/
  /* interactive calls iBus */

  public getiBusStop(codiParada: number): Observable<IiBusResponse<IiBusStop>> {
    const request = `ibus/stops/${codiParada}`;
    const url = urlTmbApi + request + this.encodeParams(this.tmbParams);
    //used this.encodeParams(this.tmbParams) instead of `?app_key=${tmb_api_key}&app_id=${tmb_api_id}`;
    return this.http.get<IiBusResponse<IiBusStop>>(url);
  }

  public getiBusStopLine(codiParada: number, codiLinia: number): Observable<IiBusResponse<IiBusRouteStop>> {
    const request = `ibus/lines/${codiLinia}/stops/${codiParada}`;
    const url = urlTmbApi + request + this.encodeParams(this.tmbParams);
    //used this.encodeParams(this.tmbParams) instead of `?app_key=${tmb_api_key}&app_id=${tmb_api_id}`;
    return this.http.get<IiBusResponse<IiBusRouteStop>>(url);
  }

  /**************************************/
  /* interactive calls transit: Horaris */

  public getRouteTimetable(codiLinia: number) {
    const request = `transit/linies/bus/${codiLinia}/horaris`;
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesRouteTimeTable));
    return this.http.get(url);
  }

  /*****************************/
  /* interactive calls transit */

  public getRouteNumbers(codiLinia?: number): Observable<any> {
    const request = `transit/linies/bus/${codiLinia ?? ""}`;
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesRouteNumbers));
    return this.http.get(url);
  }

  public getBusRouteStops(codiLinia: number): Observable<any> {
    const request = `transit/linies/bus/${codiLinia}/parades/`;
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesBusRouteStops));
    return this.http.get(url);
  }

  /* very similar to getBusStopConn, but the origin route is fixed */
  public getBusRouteStopConn(codiLinia: number, codiParada: number): Observable<any> {
    const request = `transit/linies/bus/${codiLinia}/parades/${codiParada}/corresp/`;
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesBusStopConn));
    return this.http.get(url);
  }

  public getBusInterconnConn(codiIntercanvi: number): Observable<any> {
    const request = `transit/interc/${codiIntercanvi}/corresp/`;
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesInterconnConn));
    return this.http.get(url);
  }

  /*****************************/
  /* interactive calls planner */

  public getPlan(date: Date, fromLatLng: google.maps.LatLngLiteral, latLng: google.maps.LatLngLiteral
  ): Observable<any> {
    const request = `planner/plan`;
    const url = urlTmbApi + request + this.encodeParams(this.getPlanParams(date, fromLatLng, latLng));
    console.log(url);
    return this.http.get(url);
  }

  /*****************************/
  /*****   P R I V A T E   *****/

  private encodeParams(params: TmbParamsType) {
    return "?" + (Object.keys(params) as Array<keyof typeof params>).map(function (name) {
      if (params.hasOwnProperty(name)) { return name + "=" + encodeURIComponent(params[name]!); }
      else return undefined;
    }).filter(isDefined).join("&");
  }

  private getPlanParams(date: Date, fromLatLng: google.maps.LatLngLiteral, latLng: google.maps.LatLngLiteral): ITmbPlanParams {
    let fromPlace: string = `${fromLatLng.lat},${fromLatLng.lng}`;
    let toPlace: string = `${latLng.lat},${latLng.lng}`;
    let strDate: string = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear().toString()}`;
    return {
      app_key: tmb_api_key,
      app_id: tmb_api_id,
      fromPlace: fromPlace,
      toPlace: toPlace,
      date: strDate,
      time: formatAMPM(date),
      arriveBy: "false",
      mode: "TRANSIT,WALK"
    }
  }
}
