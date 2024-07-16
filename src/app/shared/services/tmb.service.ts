import { Injectable } from '@angular/core';
import { urlTmbApi, TmbParamsType } from '../model/tmbParams';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tmb_api_id, tmb_api_key } from 'src/app/api.key';
import { StopResponse } from '../model/busStop';

@Injectable({
  providedIn: 'root'
})
export class TmbService {


  private readonly propertiesParades = "GEOMETRY,CODI_PARADA,NOM_PARADA";
  private readonly propertiesCorrespondenciesParada = "ID_OPERADOR,NOM_OPERADOR,CODI_LINIA,NOM_LINIA,DESC_LINIA,DESTI_LINIA,COLOR_LINIA";

  private readonly propertiesLinies = "NOM_LINIA,DESC_LINIA,CODI_LINIA,ORIGEN_LINIA,DESTI_LINIA";
  private readonly propertiesParadesLinia = "GEOMETRY,SENTIT,ORDRE,CODI_PARADA,NOM_PARADA,CODI_INTERC,NOM_INTERC";
  private readonly propertiesLineStopInfo = "ID_OPERADOR,NOM_OPERADOR,CODI_LINIA,NOM_LINIA,DESC_LINIA,DESTI_LINIA,COLOR_LINIA";
  private readonly propertiesIntercanviInfo = "ID_OPERADOR,NOM_OPERADOR,CODI_LINIA,NOM_LINIA,DESC_LINIA,DESTI_LINIA,COLOR_LINIA,GEOMETRY";

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

  public getStops(options?: any): Observable<any> {
    const request = "transit/parades"
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesParades));
    return this.http.get(url, options);
  }

  public getLines(options?: any): Observable<any> {
    const request = "transit/linies/bus/"
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesLinies));
    return this.http.get(url, options);
  }

  public getLineDescription(codiLinia: string, options?: any): Observable<any> {
    const request = "transit/linies/bus/" + codiLinia
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesLinies))
    return this.http.get(url, options);
  }

  public getLineStops(codiLinia: string, options?: any): Observable<any> {
    const request = "transit/linies/bus/" + codiLinia + "/parades/";
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesParadesLinia));
    return this.http.get(url, options);
  }

  public getLineStopInfo(codiLinia: string, codiParada: string, options?: any): Observable<any> {
    const request = "transit/linies/bus/" + codiLinia + "/parades/" + codiParada + "/corresp/";
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesLineStopInfo));
    return this.http.get(url, options);
  }

  public getIntercanviInfo(codiIntercanvi: string, options?: any): Observable<any> {
    const request = "transit/interc/" + codiIntercanvi + "/corresp/";
    const url = urlTmbApi + request + this.encodeParams(this.getParams(this.propertiesIntercanviInfo));
    return this.http.get(url, options);
  }

  // Converts a GeoJSON FeatureCollection structure into a "flat" array of object properties.
  // Geometries are discarded.
  public properties(featureCollection: any) {
    var properties: any = [];
    featureCollection.features.forEach(function (feature: any) {
      var itemProperties = feature.properties;
      if (!!feature.geometry?.coordinates) {
        Object.defineProperty(itemProperties, 'GEOMETRY', { value: feature.geometry.coordinates });
      }
      properties.push(itemProperties);
    });
    return properties;
  }

  private encodeParams(params: TmbParamsType) {
    return "?" + (Object.keys(params) as Array<keyof typeof params>).map(function (name) {
      return name + "=" + encodeURIComponent(params[name]);
    }).join("&");
  }

  public getStop(codiParada: number): Observable<StopResponse> {
    const url = `${urlTmbApi}/ibus/stops/${codiParada}?app_key=${tmb_api_key}&app_id=${tmb_api_id}`;
    return this.http.get<StopResponse>(url);
  }

}
