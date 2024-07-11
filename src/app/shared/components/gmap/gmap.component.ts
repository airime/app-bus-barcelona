import { CUSTOM_ELEMENTS_SCHEMA, Component, AfterViewInit } from '@angular/core';
import { GoogleMap, MapAdvancedMarker, MapInfoWindow } from "@angular/google-maps";
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { googleMapId } from '../../../api.key';
import { PredefinedGeoPositions, geoPlaces } from '../../util/predefinedGeoPlaces';
import { IonSpinner } from '@ionic/angular/standalone'
import { LocalStorageService } from '../../services/local-storage.service';
import { Stop } from '../../model/busStop';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-gmap',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss'],
  imports: [IonSpinner, GoogleMap, MapAdvancedMarker, MapInfoWindow, RouterLink]
})
export class GmapComponent implements AfterViewInit {
  location: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  mapId: string = googleMapId;
  options!: google.maps.MapOptions;

  properties: Stop[] = [
    {
      NOM_PARADA: 'Pl. Catalunya - Pg. de Gràcia',
      CODI_PARADA: 1210,
      posicio: PredefinedGeoPositions[geoPlaces.BarcelonaBus1210],
      linies: ['55', 'D50', 'H16', 'N11']
    },
    {
      NOM_PARADA: 'Pl. de Catalunya - Ronda Sant Pere',
      CODI_PARADA: 1257,
      posicio: PredefinedGeoPositions[geoPlaces.BarcelonaBus1257],
      linies: ['D50', 'N5', 'N6', 'N7']
    },
    {
      NOM_PARADA: 'Pl. Catalunya - Bergara',
      CODI_PARADA: 1271,
      posicio: PredefinedGeoPositions[geoPlaces.BarcelonaBus1271],
      linies: ['V13', 'N17']
    },
  ];

  constructor(private localStorage: LocalStorageService) { }

  ngAfterViewInit(): void {
    this.createMap();
  }

  async createMap(): Promise<void> {
    try {
      this.location = await this.getCurrentLocation();
      if (this.location.lat === 0) {
        this.location = PredefinedGeoPositions[geoPlaces.BarcelonaCenter];
      }
      this.options = {
        zoom: 17
      };
      console.log("CREATE-MAP CALLED: ", this.location);
    } catch (err) {
      console.log(err);
      throw (err);
    }
  }

  openInfoWindow(marker: any, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  async getCurrentLocation(): Promise<google.maps.LatLngLiteral> {
    return new Promise(async (resolve, reject) => {
      const geoLocation = await this.localStorage.getGeoPosition();
      if (!geoLocation) {
        if (Capacitor.getPlatform() === 'web') {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                if (!!position) {
                  this.location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  };
                  this.localStorage.setGeoPosition(this.location);
                  resolve(this.location);
                }
              },
              (error) => {
                console.log('not granted', error);
                throw (error);
              }
            );
          } else {
            reject('Geolocation is not supported by this browser.');
          }
        } else {
          try {
            let geoPosPermision = await Geolocation.checkPermissions();
            console.log("geoPosPermision: ", geoPosPermision.location, geoPosPermision.coarseLocation);
            if (geoPosPermision.location === 'prompt' || geoPosPermision.coarseLocation === 'prompt') {
              geoPosPermision = await Geolocation.requestPermissions();
            }
            if (geoPosPermision.location === 'granted' || geoPosPermision.coarseLocation === 'granted') {
              const pos = await Geolocation.getCurrentPosition({ maximumAge: 75000, timeout: 25000 });
              this.location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              console.log("NEW location: ", this.location.lat, this.location.lng);
              this.localStorage.setGeoPosition(this.location);
              resolve(this.location);
            }
            else {
              reject('Mobile: not granted');
            }
          } catch (err) {
            reject(`Geolocation error: ${err}`);
            throw ('Error accessing geolocation on mobile');
          };
        }
      } else {
        this.location = geoLocation;
        console.log("DB resolved geolocation:", geoLocation)
        resolve(this.location);
      }
    });
  }

}
