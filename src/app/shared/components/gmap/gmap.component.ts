import { CUSTOM_ELEMENTS_SCHEMA, Component, AfterViewInit } from '@angular/core';
import {GoogleMap, MapAdvancedMarker, MapInfoWindow} from "@angular/google-maps";
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
      direccion: 'Carrer de Mallorca, 401, 08013 Barcelona, España',
      title: 'Posicion 1',
      descripcion: 'Cerca de la Sagrada Familia',
      posicion: {
        lat: 41.4036299,
        lng: 2.1743558
      }
    },
    {
      direccion: 'La Rambla, 91, 08002 Barcelona, España',
      title: 'Posicion 2',
      descripcion: 'Cerca del Mercado de La Boqueria',
      posicion: {
        lat: 41.3825648,
        lng: 2.1722458
      }
    },
    {
      direccion: 'Passeig de Gràcia, 43, 08007 Barcelona, España',
      title: 'Posicion 3',
      descripcion: 'Cerca de la Casa Batlló',
      posicion: {
        lat: 41.3916407,
        lng: 2.1651224
      }
    },
    {
      direccion: 'Parc Güell, 08024 Barcelona, España',
      title: 'Posicion 4',
      descripcion: 'Parque Güell',
      posicion: {
        lat: 41.4144949,
        lng: 2.1526944
      }
    },
    {
      direccion: 'Avinguda Diagonal, 686, 08034 Barcelona, España',
      title: 'Posicion 5',
      descripcion: 'Cerca del Camp Nou',
      posicion: {
        lat: 41.3808961,
        lng: 2.1228208
      }
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
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              console.log(
                'Latitude: ' +
                position.coords.latitude +
                'Longitude: ' +
                position.coords.longitude
              );
              let lat = position.coords.latitude;
              let lng = position.coords.longitude;

              const location = {
                lat,
                lng,
              };
              resolve(location);
            }
          },
          (error) => console.log(error)
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

}
