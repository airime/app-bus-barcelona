import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { tmb_api_id, tmb_api_key } from 'src/app/api.key';
import { StopResponse } from '../model/busStop';

@Injectable({
  providedIn: 'root'
})
export class TmbApiService {
  private tmbApiUrl = ' https://api.tmb.cat/v1/ibus/stops';  // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  getStop(id: number): Observable<StopResponse> {
    const url = `${this.tmbApiUrl}/${id}?app_key=${tmb_api_key}&app_id=${tmb_api_id}`;
    return this.http.get<StopResponse>(url);
  }

}

