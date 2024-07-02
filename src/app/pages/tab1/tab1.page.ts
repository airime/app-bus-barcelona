import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';
import { GoogleMap } from '@capacitor/google-maps';
import { googleMapsApiKey } from '../../api.key


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [ MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1Page {
  constructor() {
    this.createMap();
  }

  readonly title = "Mapa busos Barcelona";


  private async createMap() {


    const mapRef = document.getElementById('map')!;

    const newMap = await GoogleMap.create({
      id: 'my-map', // Unique identifier for this map instance
      element: mapRef, // reference to the capacitor-google-map element
      apiKey: googleMapsApiKey, // Your Google Maps API Key
      config: {
        center: {
          // The initial position to be rendered by the map
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 8, // The initial zoom level to be rendered by the map
      },
    });

  }

}
