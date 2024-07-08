import { CUSTOM_ELEMENTS_SCHEMA, Component, AfterViewInit } from '@angular/core';
import {GoogleMap, MapAdvancedMarker, MapInfoWindow} from "@angular/google-maps";
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { googleMapId } from '../../../api.key';
import { PredefinedGeoPositions, geoPlaces } from '../../util/predefinedGeoPlaces';

@Component({
  standalone: true,
  selector: 'app-gmap',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss'],
  imports: [GoogleMap, MapAdvancedMarker, MapInfoWindow]
})
export class GmapComponent implements AfterViewInit {
  location: google.maps.LatLngLiteral = PredefinedGeoPositions[geoPlaces.BarcelonaCenter];
  mapId: string = googleMapId;
  options!: google.maps.MapOptions;

  //TODO: adapt this to our predefined geoplaces
  properties = [
    {
      title: 'Posicion 1',
      descripcion: 'Barcelona Ciutat Vella',
      posicion: PredefinedGeoPositions[geoPlaces.BarcelonaCiutatVella]
    },
    {
      title: 'Posicion 2',
      descripcion: 'Barcelona Eixample',
      posicion: PredefinedGeoPositions[geoPlaces.BarcelonaEixample]
    },
    {
      title: 'Posicion 3',
      descripcion: 'Barcelona Sants',
      posicion: PredefinedGeoPositions[geoPlaces.BarcelonaSants]
    },
    {
      title: 'Posicion 4',
      descripcion: 'Barcelona Les Corts',
      posicion: PredefinedGeoPositions[geoPlaces.BarcelonaLesCorts]
    },
    {
      title: 'Posicion 5',
      descripcion: 'Barcelona Sarrià',
      posicion: PredefinedGeoPositions[geoPlaces.BarcelonaSarria]
    },
    {
      title: 'Posicion 6',
      descripcion: 'Barcelona Gràcia',
      posicion: PredefinedGeoPositions[geoPlaces.BarcelonaGracia]
    },
    {
      title: 'Posicion 7',
      descripcion: 'Barcelona Horta',
      posicion: PredefinedGeoPositions[geoPlaces.BarcelonaHorta]
    },
    {
      title: 'Posicion 8',
      descripcion: 'Barcelona Nou Barris',
      posicion: PredefinedGeoPositions[geoPlaces.BarcelonaNouBarris]
    },
    {
      title: 'Posicion 9',
      descripcion: 'Barcelona Sant Andreu',
      posicion: PredefinedGeoPositions[geoPlaces.BarcelonaStAndreu]
    },
    {
      title: 'Posicion 10',
      descripcion: 'Barcelona Sant Martí',
      posicion: PredefinedGeoPositions[geoPlaces.BarcelonaStMarti]
    }
  ];

  constructor() {}

  ngAfterViewInit(): void {
    this.createMap();
  }

  async createMap(): Promise<void> {
    try {
      this.location = await this.getCurrentLocation();
      this.options = {
        zoom: 17
      };
      console.log("CREATE-MAP CALLED: ", this.location);
    } catch(err) {
      console.log(err);
      throw(err);
    }
  }

  openInfoWindow(marker: any, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  async getCurrentLocation(): Promise<google.maps.LatLngLiteral> {
    return new Promise(async (resolve, reject) => {
      if (Capacitor.getPlatform() === 'web') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (position) {
                const location = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                resolve(location);
              }
            },
            (error) => {
              console.log('not granted', error);
              throw(error);
            }
          );
        } else {
          reject('Geolocation is not supported by this browser.');
        }
      } else {
        try {
          let geoPosPermision = await Geolocation.checkPermissions();
          console.log("geoPosPermision: ", geoPosPermision.location, geoPosPermision.coarseLocation);
          if (geoPosPermision.location === 'prompt' || geoPosPermision.coarseLocation === 'prompt')
          {
              geoPosPermision = await Geolocation.requestPermissions();
          }
          if (geoPosPermision.location === 'granted' || geoPosPermision.coarseLocation === 'granted')
          {
            const pos = await Geolocation.getCurrentPosition( { maximumAge:75000, timeout:25000 });
            this.location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            console.log("NEW location: ", this.location.lat, this.location.lng);
            resolve(this.location);
          }
          else {
            reject('Mobile: not granted');
          }
        } catch(err) {
          reject(`Geolocation error: ${err}`);
          throw('Error accessing geolocation on mobile');
        };
      }
    });
  }

}
