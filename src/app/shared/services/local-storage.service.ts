import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { NotFoundError } from '../util/errors';
import { StoredCoordinates, createStoredCoordinates, storedCoordHasTimeout } from '../interfaces/storedCoordinates';
import { createStoredToken, StoredToken, storedTokenHasTimeout } from '../interfaces/storedToken';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private _timeout = 210; // 3:30 minuts

  constructor() {
  }

  public set defaultTimeout(timeoutSeconds: number) {
    this._timeout = timeoutSeconds;
  }

  // Create and expose methods that users of this service can
  public async set<T>(key: string, value: T) {
    const json = JSON.stringify(value);
    Preferences.set({ key: key, value: json });
  }

  public async get<T>(key: string): Promise<T | undefined> {
    return new Promise<T>(async ( resolve, reject ) => {
       const { value } = await Preferences.get({ key: key });
       if (!!value) {
        const typedValue = JSON.parse(value);
        if (typedValue satisfies T) resolve(value as T);
        else reject(new TypeError());
      } 
       else reject(new NotFoundError(`${key} not found.`));
    });
  }

  public async tryGet<T>(key: string): Promise<T | undefined> {
    return new Promise<T | undefined>(async ( resolve, reject ) => {
      const { value } = await Preferences.get({ key: key });
      if (!!value) {
        const typedValue = JSON.parse(value);
        if (typedValue satisfies T) resolve(typedValue as T);
        else reject(new TypeError());
      }
      else resolve(undefined);
    });
  }

  public async setUserToken(value: string) {
    console.log("token will be stored in cache.");
    this.set<StoredToken>("token", createStoredToken(value));
  }

  public async getUserToken(): Promise<string | undefined> {
    const value = await this.tryGet<StoredToken>("token");
    if (!!value) {
      if (storedTokenHasTimeout(value, this._timeout)) {
        console.log("DBtoken has timeout: removed from cache.");
        Preferences.remove({ key: "token" });
        return undefined;
      } else {
        console.log("DBtoken retrieved from cache.");
        return value[1];
      }
    } else {
      console.log("no DBtoken found in cache.");
      return undefined;
    }
  }

  public async setGeoPosition(value: google.maps.LatLngLiteral) {
    this.set<StoredCoordinates>("actualPos", createStoredCoordinates(value))
  }

  public async getGeoPosition(): Promise<google.maps.LatLngLiteral | undefined> {
    const value = await this.tryGet<StoredCoordinates>("actualPos");
    if (!!value) {
      if (storedCoordHasTimeout(value, this._timeout)) {
        console.log("DBgeolocation has timeout: remove for cache update");
        Preferences.remove({ key: "actualPos" });
        return undefined;
      } else {
        return value[1];
      }
    }
    else return undefined;
  }

}
