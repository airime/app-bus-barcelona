import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit, Input, numberAttribute, NgZone, ElementRef } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { googleMapId } from '../../../api.key';
import { PredefinedGeoPositions, geoPlaces } from '../../util/predefinedGeoPlaces';
import { LocalStorageService } from '../../services/local-storage.service';
import { IStop } from '../../model/ibusStop';
import { StaticDataService } from '../../services/static-data.service'

@Component({
  selector: 'app-gmap',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss'],
})
export class GmapComponent implements OnInit {
  @Input({transform: numberAttribute}) lat?: number
  @Input({transform: numberAttribute}) lng?: number

  public readonly BusStop = 'assets/icon/Bus_Stop.svg';
  readonly predefinedLat = PredefinedGeoPositions[geoPlaces.BarcelonaCenter].lat;

  public location: google.maps.LatLngLiteral = PredefinedGeoPositions[geoPlaces.BarcelonaCenter];
  private map!: google.maps.Map;

  private readonly stops: IStop[] = 
   [
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
              private localStorage: LocalStorageService,
              private staticData: StaticDataService) { 
  }

  ngOnInit() {

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
    setTimeout(() => { this.initMap(); }, 200);
    if (!!this.lat && !!this.lng) {
      this.location = { lat: this.lat, lng: this.lng };
    } else {
      this.getCurrentLocation(); //async result, but it internally sets this.location
    }
  }

  public set center(latlng: google.maps.LatLngLiteral) {
    this.map.setCenter(latlng);
  }

  private async centerOnCurrentLocation() {
    let location = await this.getCurrentLocation();
    this.map.setCenter(location);
  }


  private async getCurrentLocation(): Promise<google.maps.LatLngLiteral> {
    return new Promise(async (resolve, reject) => {
      const geoLocation = await this.localStorage.getGeoPosition();
      if (!geoLocation) {
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
      } else {
        this.location = geoLocation;
        console.log("DB resolved geolocation:", geoLocation);
        resolve(this.location);
      }
    });
  }

  // wait async variable value change
  private async waitForLocation() {
    function timeout(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    if (this.location.lat == this.predefinedLat) {
      console.log("waiting for location...");
      await timeout(300).then(() => { this.waitForLocation(); return; });
      if (this.location.lat == this.predefinedLat) {
        console.log("still no location available; it will retry async every 300ms, and then set map.center");
      }
    } else {
      console.log("geoposition has set location");
      if (!this.map) {
        console.log("waiting for map to be drawn...");
        await timeout(150).then(() => { this.waitForLocation(); return; });
      } else {
        this.map.setCenter(this.location);
        console.log("map center set", this.location);
      }
      return;
    }
  }

  private async initMap() {
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
      console.log("MAP CREATED");
      const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
      });
    
      const markers: google.maps.marker.AdvancedMarkerElement[] =
        this.stops.map( (stop: IStop, i: number) => {
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

  openInfoWindow(marker: any, infoWindow: google.maps.InfoWindow, codiParada: number, nomParada: string, linies?: string[]) {
    let linesParada: string = "";
    if (!!linies) {
      for (let line of linies) {
        linesParada += `<a onclick='callAngularClickParadaLinia(${codiParada},"${line}")'><ion-badge>${line}</ion-badge></a>&nbsp;`;
      }
    }
    const content = `\
<ion-icon size="large" src="/assets/icon/Bus_Stop.svg"></ion-icon>
<div style="height:12ex; margin:0; padding:0">
  <a onclick='callAngularClickParada(${codiParada})'>\
  <h5>${nomParada}</h5></a>\
  <div>\
    <div>${linesParada}</div>\
    <div style="color:black">prova styles</div>\
  </div> \
</div>`
    infoWindow.setContent(content);
    infoWindow.open(this.map, marker);
  }

  clickParada(codiParada: number) {
    console.log(`CLICK ${codiParada}`)
  }

  clickParadaLinia(codiParada: number, codiLinia: string)  {
    console.log(`CLICK ${codiParada} en línia ${codiLinia}`);
  }
  
  private get busStopIcon() {
    const content = document.createElement("div");
    content.innerHTML = `<ion-icon size="large" src="/assets/icon/Bus_Stop.svg"></ion-icon>`
    return content;

    /* SIMILAR CODE FROM GOOGLE FOR SVG marker glyph, but using a <img> element */
    /* We instead use <div> with a <ion-icon> inside */
    /*
      const glyphImg = document.createElement("img");

      glyphImg.src =
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/google_logo_g.svg";

      const glyphSvgPinElement = new PinElement({
        glyph: glyphImg,
      });
      const glyphSvgMarkerView = new AdvancedMarkerElement({
        map,
        position: { lat: 37.425, lng: -122.07 },
        content: glyphSvgPinElement.element,
        title: "A marker using a custom SVG for the glyph.",
      });
    */

  }


  /*****************************************************/
  /* busStopIcon: OTHER WAYS TO USE images FOR MARKERS */

  /* 1) A marker with a custom inline SVG. */
  /*
    const parser = new DOMParser();
    const pinSvgString =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">...</svg>';
    const pinSvg = parser.parseFromString(
      pinSvgString,
      "image/svg+xml",
    ).documentElement;
    const pinSvgMarkerView = new AdvancedMarkerElement({
      map,
      position: { lat: 37.42475, lng: -122.094 },
      content: pinSvg,
      title: "A marker using a custom SVG image.",
    });
  */

  /* 2) A marker with a with a URL pointing to a PNG. */
  /*
  const beachFlagImg = document.createElement("img");

  beachFlagImg.src =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

  const beachFlagMarkerView = new AdvancedMarkerElement({
    map,
    position: { lat: 37.434, lng: -122.082 },
    content: beachFlagImg,
    title: "A marker using a custom PNG Image",
  });
  */


/**************************/
/* ADD MY LOCATION BUTTON */
/*


function addYourLocationButton(map, marker) 
{
    var controlDiv = document.createElement('div');
    
    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);
    
    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);
    
    google.maps.event.addListener(map, 'dragend', function() {
        $('#you_location_img').css('background-position', '0px 0px');
    });

    firstChild.addEventListener('click', function() {
        var imgX = '0';
        var animationInterval = setInterval(function(){
            if(imgX == '-18') imgX = '0';
            else imgX = '-18';
            $('#you_location_img').css('background-position', imgX+'px 0px');
        }, 500);
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                marker.setPosition(latlng);
                map.setCenter(latlng);
                clearInterval(animationInterval);
                $('#you_location_img').css('background-position', '-144px 0px');
            });
        }
        else{
            clearInterval(animationInterval);
            $('#you_location_img').css('background-position', '0px 0px');
        }
    });
    
    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: faisalabad
    });
    var myMarker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: faisalabad
    });
    addYourLocationButton(map, myMarker);
}

$(document).ready(function(e) {
    initMap();
}); 

*/

}
