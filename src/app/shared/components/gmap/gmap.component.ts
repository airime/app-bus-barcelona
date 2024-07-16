import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit, Input, numberAttribute, NgZone, ElementRef } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { googleMapId } from '../../../api.key';
import { PredefinedGeoPositions, geoPlaces } from '../../util/predefinedGeoPlaces';
import { LocalStorageService } from '../../services/local-storage.service';
import { Stop } from '../../model/busStop';

@Component({
  selector: 'app-gmap',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss'],
})
export class GmapComponent implements OnInit, AfterViewInit {
  @Input({transform: numberAttribute}) lat?: number
  @Input({transform: numberAttribute}) lng?: number

  public readonly BusStop = 'assets/Bus_Stop.svg';
  readonly predefinedLat = PredefinedGeoPositions[geoPlaces.BarcelonaCenter].lat;
  private readonly parser;

  public location: google.maps.LatLngLiteral = PredefinedGeoPositions[geoPlaces.BarcelonaCenter];

  stops: Stop[] = [
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

  ngOnInit() {
    setTimeout(() => { this.initMap(); }, 200);
    if (!!this.lat && !!this.lng) {
      this.location = { lat: this.lat, lng: this.lng };
    } else {
      this.getCurrentLocation(); //async result, but sets this.location
    }
  }

  ngAfterViewInit(): void {
   // No method (using 200ms timeout for this.initMap)
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
            throw ('Error accessing geolocation');
          };
        //}
      } else {
        this.location = geoLocation;
        console.log("DB resolved geolocation:", geoLocation);
        resolve(this.location);
      }
    });
  }

  // wait async variable value change
  async waitForLocation() {
    function timeout(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    if (this.location.lat == this.predefinedLat || !this.map) {
      console.log("waiting for location...");
      await timeout(300).then(() => { this.waitForLocation(); return; });
      if (this.location.lat == this.predefinedLat) {
        console.log("after 300ms it will retry async every 300ms, and then set map.center");
      }
    } else {
      console.log("geoposition has set location");
      this.map.setCenter(this.location);
      console.log("map center set");
      return;
    }
  }

  private map!: google.maps.Map;

  async initMap() {
    try {
      // Request needed libraries.
      const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;   

      await this.waitForLocation();
      console.log("current location: ", this.location);
      this.map = new Map(document.getElementById("map") as HTMLElement, {
        zoom: 17,
        center: this.location,
        mapId: googleMapId,
        clickableIcons: false,
      });
      console.log("CREATE-MAP CALLED: ", this.location);
      const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
      });
    
      const markers: google.maps.marker.AdvancedMarkerElement[] =
        this.stops.map( (stop: Stop, i: number) => {
          const pinGlyph = new google.maps.marker.PinElement({
            glyph: this.busStopIcon,
            glyphColor: "white",
          })
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: this.map,
            position: stop.posicio,
            content: pinGlyph.element,
          });
      
          // markers can only be keyboard focusable when they have click listeners
          // open info window when marker is clicked
          marker.addListener("click", () => {
            this.openInfoWindow(marker, infoWindow, stop.CODI_PARADA, stop.NOM_PARADA, stop.linies)
        });
        return marker;
      });
      new MarkerClusterer({ markers, map: this.map });

    } catch (err) {
      console.log(err);
      throw (err);
    }
  }

  // toggleHighlight(markerView: any, stop: Stop) {
  //   console.log("CLICK!")
  //   if (markerView.content.classList.contains("highlight")) {
  //     markerView.content.classList.remove("highlight");
  //     markerView.zIndex = null;
  //   } else {
  //     markerView.content.classList.add("highlight");
  //     markerView.zIndex = 1;
  //   }
  // }


  openInfoWindow(marker: any, infoWindow: google.maps.InfoWindow, codiParada: number, nomParada: string, linies?: string[]) {
    let linesParada: string = "";
    if (!!linies) {
      for (let line of linies) {
        linesParada += `<a onclick='callAngularClickParadaLinia(${codiParada},"${line}")'><ion-badge>${line}</ion-badge></a>&nbsp;`;
      }
    }
    //console.log(infoWindow.getContent());
    //<a [routerLink]="['/private/stop', m.CODI_PARADA]>
    const content = `\
<ion-icon size="large" src="/assets/Bus_Stop.svg"></ion-icon>
<div style="height:12ex; margin:0; padding:0">
  <a onclick='callAngularClickParada(${codiParada})'>\
  <h5>${nomParada}</h5></a>\
  <div>\
    <div>${linesParada}</div>\
    <div style="color:black">prova anchor</div>\
  </div> \
</div>`
    infoWindow.setContent(content);
    infoWindow.open(this.map, marker);
  }

  
  private get busStopIcon() {
    const content = document.createElement("div");
    content.classList.add("stop");
    content.innerHTML = `<ion-icon size="large" style="top:0;left:0" src="/assets/Bus_Stop.svg"></ion-icon>`
    return content;
  }

  // NOT USED
  buildContent(stop: Stop) {
    const content = document.createElement("div");
    content.classList.add("stop");
    content.innerHTML = `<ion-icon size="large" src="/assets/Bus_Stop.svg"></ion-icon>`

    // const content = document.createElement("div");
    // content.classList.add("property");
    // content.innerHTML = `
    //   <div class="icon">
    //       <ion-icon src="/assets/Bus_Stop.svg"></ion-icon>
    //   </div>
    //   <div class="details">
    //     <h5>${stop.NOM_PARADA}</h5>
    //     <div class="features">
    //       <b>FEATURES</b>
    //     </div>
    //   </div>
    //   `;
    return content;
  }

}
