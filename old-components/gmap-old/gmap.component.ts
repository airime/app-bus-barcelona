import { CUSTOM_ELEMENTS_SCHEMA, Component, AfterViewInit, Input, numberAttribute, OnInit, NgZone, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleMap, MapAdvancedMarker, MapInfoWindow, MapMarkerClusterer } from "@angular/google-maps";
import { Geolocation } from '@capacitor/geolocation';
import { googleMapId } from '../../../api.key';
import { PredefinedGeoPositions, geoPlaces } from '../../util/predefinedGeoPlaces';
import { IonSpinner, IonBadge, IonIcon } from '@ionic/angular/standalone';
import { LocalStorageService } from '../../services/local-storage.service';
import { Stop } from '../../model/busStop';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-gmap',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss'],
  imports: [GoogleMap, MapAdvancedMarker, MapMarkerClusterer, MapInfoWindow, IonSpinner, IonIcon, IonBadge, RouterLink]
})
export class GmapComponent implements OnInit, AfterViewInit {
  @Input({transform: numberAttribute}) lat?: number
  @Input({transform: numberAttribute}) lng?: number

  get mapId(): string{ return googleMapId; }

  mapOptions!: google.maps.MapOptions;

  location: google.maps.LatLngLiteral = PredefinedGeoPositions[geoPlaces.BarcelonaCenter];
  readonly predefinedLat = PredefinedGeoPositions[geoPlaces.BarcelonaCenter].lat;

  public readonly BusStop = 'assets/icon/Bus_Stop.svg';
  private readonly parser;

  // A marker with a custom inline SVG.
  public get pinSvg() {
    const pinSvgString = '<svg version="1.1" x="16" y="0" width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><style>.st1{fill:#fff}</style><circle cx="199.8" cy="200.3" r="36.527" style="fill: rgb(229, 53, 23);" transform="matrix(0.438032, 0, 0, 0.389517, -71.518829, -61.248028)"></circle><path class="st1" d="M 25.458 11.929 L 25.458 9.538 C 25.458 8.661 24.657 7.949 23.671 7.949 L 9.34 7.949 C 8.346 7.949 7.545 8.661 7.545 9.538 L 7.545 11.134 L 5.749 11.134 L 5.749 11.172 C 5.682 11.149 5.606 11.134 5.521 11.134 C 5.15 11.134 4.847 11.404 4.847 11.734 L 4.847 14.523 C 4.847 14.853 5.15 15.123 5.521 15.123 C 5.892 15.123 6.196 14.853 6.196 14.523 L 6.196 12.334 L 7.537 12.334 L 7.537 23.878 C 7.537 24.756 8.337 25.468 9.332 25.468 L 9.332 26.27 C 9.332 26.712 9.728 27.064 10.225 27.064 L 11.127 27.064 C 11.625 27.064 12.02 26.704 12.02 26.27 L 12.02 25.475 L 20.981 25.475 L 20.981 26.27 C 20.981 26.712 21.378 27.064 21.876 27.064 L 22.77 27.064 C 23.266 27.064 23.662 26.704 23.662 26.27 L 23.662 25.475 C 24.649 25.475 25.45 24.763 25.45 23.886 L 25.45 15.917 C 25.947 15.917 26.344 15.557 26.344 15.123 L 26.344 12.731 C 26.352 12.288 25.947 11.929 25.458 11.929 M 8.918 9.545 C 8.918 9.343 9.104 9.178 9.332 9.178 L 10.672 9.178 L 10.672 11.142 L 8.911 11.142 L 8.911 9.545 L 8.918 9.545 Z M 17.391 16.315 L 17.391 17.507 L 18.959 17.507 L 18.959 18.646 L 8.952 18.646 L 8.952 12.386 L 24.051 12.386 L 24.051 18.646 L 20.307 18.646 L 20.307 17.507 L 21.876 17.507 L 21.876 16.315 L 17.391 16.315 Z M 24.076 23.878 C 24.076 24.081 23.89 24.246 23.662 24.246 L 9.332 24.246 C 9.104 24.246 8.918 24.081 8.918 23.878 L 8.918 19.898 L 24.084 19.898 L 24.084 23.878 L 24.076 23.878 Z M 24.076 11.134 L 13.361 11.134 L 13.361 9.171 L 23.662 9.171 C 23.89 9.171 24.076 9.336 24.076 9.538 L 24.076 11.134 Z" style=""></path><path class="st1" d="M 11.127 23.084 L 12.915 23.084 C 13.411 23.084 13.808 22.724 13.808 22.289 C 13.808 21.846 13.403 21.494 12.915 21.494 L 11.127 21.494 C 10.63 21.494 10.234 21.855 10.234 22.289 C 10.225 22.724 10.63 23.084 11.127 23.084 M 20.08 23.084 L 21.867 23.084 C 22.364 23.084 22.761 22.724 22.761 22.289 C 22.761 21.846 22.364 21.494 21.867 21.494 L 20.08 21.494 C 19.583 21.494 19.186 21.855 19.186 22.289 C 19.186 22.724 19.583 23.084 20.08 23.084" style=""></path></svg>';
    return this.parser.parseFromString(pinSvgString, 'image/svg+xml').documentElement;
  }

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

  constructor(private ngZone: NgZone,
              private elementRef:ElementRef,
              private localStorage: LocalStorageService) { 
    this.parser = new DOMParser();
  }

  ngOnInit(): void {

    let s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "assets/callAngularClickParada.js";
    this.elementRef.nativeElement.appendChild(s);

    // @ts-ignore
    window['angularComponentReference'] = {
      component: this, 
      zone: this.ngZone, 
      loadAngularFunctionClickParada: (codiParada: number) => this.clickParada(codiParada), 
      loadAngularFunctionClickParadaLinia: (codiParada: number, codiLinia: string) => this.clickParadaLinia(codiParada, codiLinia), 
    }; 
  }

  ngAfterViewInit(): void {
    this.createMap();
  }

  async getCurrentLocation(): Promise<google.maps.LatLngLiteral> {
    return new Promise(async (resolve, reject) => {
      const geoLocation = await this.localStorage.getGeoPosition();
      if (!geoLocation) {
        /*
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
        */
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
              reject('Permission: not granted');
            }
          } catch (err) {
            reject(`Geolocation error: ${err}`);
            throw ('Error accessing geolocation on mobile');
          };
        //}
      } else {
        this.location = geoLocation;
        console.log("DB resolved geolocation:", geoLocation);
        resolve(this.location);
      }
    });
  }
  
  async createMap(): Promise<void> {
    try {
      if (!!this.lat && !!this.lng) {
        this.location = { lat: this.lat, lng: this.lng };
      } else {
        this.location = await this.getCurrentLocation();
      }
      this.mapOptions =  { zoom: 17 };
      console.log("CREATE-MAP CALLED: ", this.location);
    } catch (err) {
      console.log(err);
      throw (err);
    }
  }

  openInfoWindow(marker: any, infoWindow: MapInfoWindow, codiParada: number, nomParada: string, linies?: string[]) {
    let linesParada: string = "";
    if (!!linies) {
      for (let line of linies) {
        linesParada += `<a onclick='callAngularClickParadaLinia(${codiParada},"${line}")'><ion-badge>${line}</ion-badge></a>`;
      }
    }
    //console.log(infoWindow.getContent());
    const content = `<a onclick='callAngularClickParada(${codiParada})'> \
          <h5 class="title">${nomParada}</h5></a> \
          <div>${linesParada}</div>`
    infoWindow.infoWindow?.setContent(content)
    infoWindow.open(marker, true, content);
  }

  clickParada(codiParada: number) {
    console.log(`CLICK ${codiParada}`)
  }

  clickParadaLinia(codiParada: number, codiLinia: string)  {
    console.log(`CLICK ${codiParada} en línia ${codiLinia}`);
  }

}
