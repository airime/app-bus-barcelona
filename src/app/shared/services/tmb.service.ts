import { Injectable } from '@angular/core';
import { urlTmbApi, TmbParamsType } from '../model/tmbParams';
import { IStopResponse } from '../model/ibusStop';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tmb_api_id, tmb_api_key } from 'src/app/api.key';
import { isDefined } from '../util/util';

@Injectable({
  providedIn: 'root'
})
export class TmbService {


  /* used for construction of personalized fixed data */
  private readonly propertiesBusStops = "GEOMETRY,CODI_PARADA,NOM_PARADA,CODI_INTERC,NOM_INTERC";
  private readonly propertiesBusStopCorresp = "ID_OPERADOR,NOM_OPERADOR,CODI_LINIA,NOM_LINIA,DESC_LINIA,DESTI_LINIA,COLOR_LINIA";
  private readonly propertiesIntercanviBusStops = "GEOMETRY,CODI_PARADA,NOM_PARADA";

  /* interactive calls */
  private readonly propertiesLinies = "NOM_LINIA,DESC_LINIA,CODI_LINIA,ORIGEN_LINIA,DESTI_LINIA";
  private readonly propertiesParadesLinia = "GEOMETRY,SENTIT,ORDRE,CODI_PARADA,NOM_PARADA,CODI_INTERC,NOM_INTERC";
  private readonly propertiesLineStopCorresp = "ID_OPERADOR,NOM_OPERADOR,CODI_LINIA,NOM_LINIA,DESC_LINIA,DESTI_LINIA,COLOR_LINIA";
  private readonly propertiesIntercanviCorresp = "ID_OPERADOR,NOM_OPERADOR,CODI_LINIA,NOM_LINIA,DESC_LINIA,DESTI_LINIA,COLOR_LINIA,GEOMETRY";

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
  /* used for construction of personalized fixed data */

  public getBusStops(options?: any): Observable<any> {
    const request = "transit/parades";
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesBusStops));
    return this.http.get(url, options);
  }

  /*********************/
  /* interactive calls */

  public getiBusStop(codiParada: number): Observable<IStopResponse> {
    const request = `ibus/stops/${codiParada}`;
    const url = urlTmbApi + request + this.encodeParams(this.tmbParams);
    //used this.encodeParams(this.tmbParams) instead of `?app_key=${tmb_api_key}&app_id=${tmb_api_id}`;
    return this.http.get<IStopResponse>(url);
  }

  public getLines(options?: any): Observable<any> {
    const request = "transit/linies/bus/";
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesLinies));
    return this.http.get(url, options);
  }

  public getLineDescription(codiLinia: string, options?: any): Observable<any> {
    const request = "transit/linies/bus/" + codiLinia
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesLinies))
    return this.http.get(url, options);
  }

  public getLineStops(codiLinia: string, options?: any): Observable<any> {
    const request = `transit/linies/bus/${codiLinia}/parades/`;
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesParadesLinia));
    return this.http.get(url, options);
  }

  public getLineStopInfo(codiLinia: string, codiParada: string, options?: any): Observable<any> {
    const request = "transit/linies/bus/" + codiLinia + "/parades/" + codiParada + "/corresp/";
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesLineStopCorresp));
    return this.http.get(url, options);
  }

  public getIntercanviInfo(codiIntercanvi: string, options?: any): Observable<any> {
    const request = "transit/interc/" + codiIntercanvi + "/corresp/";
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesIntercanviCorresp));
    return this.http.get(url, options);
  }

  // Converts a GeoJSON FeatureCollection structure into a "flat" array of object properties.
  // Geometries are discarded.
  public properties(featureCollection: any) {
    const properties: any = [];
    featureCollection.features.forEach(function (feature: any) {
      const itemProperties = feature.properties;
      if (!!feature.geometry?.coordinates) {
        Object.defineProperty(itemProperties, 'GEOMETRY', { value: feature.geometry.coordinates });
      }
      properties.push(itemProperties);
    });
    return properties;
  }

  private encodeParams(params: TmbParamsType) {
    return "?" + (Object.keys(params) as Array<keyof typeof params>).map(function (name) {
      if (params.hasOwnProperty(name)) { return name + "=" + encodeURIComponent(params[name]!); }
      else return undefined;
    }).filter(isDefined).join("&");
  }

}
