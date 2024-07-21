import { Injectable } from '@angular/core';
import { IStopInfo } from '../model/internalInterfaces';

/***********************************************************/
/****    Service to read our static data (JSON file)    ****/
/***********************************************************/

  // The use of "fetch" seemed preferable to using a direct import
  // which requires set compiler option 'resolveJsonModule'
  // https://www.thirdrocktechkno.com/blog/how-to-read-local-json-files-in-angular/

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  public get data() {
    return this._data;
  }

  private _data!: Promise<IStopInfo[]>;

  constructor() {
    const data_dades = '2024-07-19';
    this._data = fetch(`assets/data.${data_dades}.json`).then((res: Response) => {
        if (res.status == 200) return res.json(); else throw new Error("StaticDataService.fetch error");
      })
      .catch(err => { 
        console.log("StaticDataService error: ", err); 
        throw err;
      });
   }

}
