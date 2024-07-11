import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';

import { urlTmbApi, TmbParamsType } from '../model/tmbParams';
import { tmb_api_id, tmb_api_key } from 'src/app/api.key';

@Injectable({
  providedIn: 'root'
})
export class TmbService {

  private readonly paramsLinies: TmbParamsType = {
    app_key: tmb_api_key,
    app_id: tmb_api_id,
    // Undocumented API feature, use "propertyName" to select properties to be returned (& discard geometry)
    propertyName: "NOM_LINIA,DESC_LINIA,CODI_LINIA,ORIGEN_LINIA,DESTI_LINIA"
  };

  private readonly paramsParadesLinia = {
    app_key: tmb_api_key,
    app_id: tmb_api_id,
    // Undocumented API feature, use "propertyName" to select properties to be returned (& discard geometry)
    propertyName: "SENTIT,ORDRE,CODI_PARADA,NOM_PARADA,CODI_INTERC,NOM_INTERC"
  };


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
  
  public getLines(options?: any): Observable<any> { 
    const request = "transit/linies/bus/"
    const url = urlTmbApi + request + this.encodeParams(this.paramsLinies)
    return this.http.get(url, options); 
  } 
  
  public getLineStops(codiLinia: string, options?: any): Observable<any> { 
    const request = "transit/linies/bus/" + codiLinia + "/parades/";
    const url = urlTmbApi + request + this.encodeParams(this.paramsParadesLinia)
    return this.http.get(url, options); 
  } 

  private encodeParams(params: TmbParamsType) {
    return "?" + (Object.keys(params) as Array<keyof typeof params>).map(function (name) {
      return name + "=" + encodeURIComponent(params[name]);
    }).join("&");
  }


}
