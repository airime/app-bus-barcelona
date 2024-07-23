import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit, Input, numberAttribute, NgZone, ElementRef } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { googleMapId } from '../../../api.key';
import { PredefinedGeoPositions, geoPlaces } from '../../util/predefinedGeoPlaces';
import { TmbGenpropertiesService } from '../../services/tmb-genproperties.service';
import { IStopInfo } from '../../model/internalInterfaces';
import { LocalStorageService } from '../../services/local-storage.service';
import { StaticDataService } from '../../services/static-data.service'
import { LatLngFromTupla } from '../../model/internalTuples';

const ShowPathEffecttimeout = 15000;

@Component({
  selector: 'app-gmap',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss'],
})
export class GmapComponent implements OnInit {
  @Input({ transform: numberAttribute }) lat?: number
  @Input({ transform: numberAttribute }) lng?: number

  public readonly BusStop = 'assets/icon/Bus_Stop.svg';
  readonly predefinedLat = PredefinedGeoPositions[geoPlaces.BarcelonaCenter].lat;

  public location: google.maps.LatLngLiteral = PredefinedGeoPositions[geoPlaces.BarcelonaCenter];
  private yourLocationVisible: boolean = false;
  private drawStack!: google.maps.Polyline[];
  private map!: google.maps.Map;
  private infoWindow!: google.maps.InfoWindow;


  private stops!: IStopInfo[];

  private readonly faisalabad = { lat: 31.417777452015976, lng: 73.07985091103124 } //a tomar por saco

  constructor(private ngZone: NgZone,
              private elementRef: ElementRef,
              private localStorage: LocalStorageService,
              private staticData: StaticDataService,
              private tmbService: TmbGenpropertiesService) {
    async function getData(that: GmapComponent): Promise<void> {
      that.stops = await that.staticData.data;
    }
    getData(this);
    this.drawStack = [];
  }

  ngOnInit() {
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "assets/callAngularClickParada.js";
    this.elementRef.nativeElement.appendChild(s);

    // @ts-ignore
    window['angularComponentReference'] = {
      component: this,
      zone: this.ngZone,
      loadAngularFunctionClickParada: (codiParada: number) => this.clickParada(codiParada),
      loadAngularFunctionClickParadaLinia: (codiParada: number, codiLinia: number, nomLinia: string) =>
        this.clickParadaLinia(codiParada, codiLinia, nomLinia),
      loadAngularFunctionClickInterc: (lat: number, lng: number, toLat: number, toLng: number) =>
        this.clickIntercanv(lat,lng,toLat,toLng),
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
    const location = await this.getCurrentLocation();
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
        streetViewControl: false,
      });
      console.log("MAP CREATED");

      const yourPositionMarker = this.createYourPositionMarker();
      this.addYourLocationButton(this, this.map, yourPositionMarker);

      const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
      });
      this.infoWindow = infoWindow;
      const markers: google.maps.marker.AdvancedMarkerElement[] =
        this.stops.map((stop: IStopInfo, i: number) => {
          const pinGlyph = new google.maps.marker.PinElement({
            glyph: this.busStopIcon,
            glyphColor: "white",
          })
          const marker = new google.maps.marker.AdvancedMarkerElement({
            map: this.map,
            position: LatLngFromTupla(stop.GEOMETRY),
            content: pinGlyph.element,
          });

          // markers can only be keyboard focusable when they have click listeners
          // open info window when marker is clicked
          if (!!stop.CODI_INTERC && stop.CODI_INTERC > 0) {
            marker.addListener("click", async () => {
              await this.openInfoWindow(marker, infoWindow, stop.CODI_PARADA, stop.NOM_PARADA, stop.CODI_INTERC, stop.NOM_INTERC!)
            });
          }
          else {
            marker.addListener("click", () => {
              this.openInfoWindow(marker, infoWindow, stop.CODI_PARADA, stop.NOM_PARADA)
            });
          }
          return marker;
        });
      new MarkerClusterer({ markers, map: this.map });

    } catch (err) {
      console.log(err);
      throw (err);
    }
  }

  async openInfoWindow(marker: google.maps.marker.AdvancedMarkerElement,
                       infoWindow: google.maps.InfoWindow,
                       codiParada: number, nomParada: string,
                       codiInterc?: number, nomInterc?: string) {
    const { liniesTram, liniesBus, liniesMetro, liniesFGC, liniesRodalies } = await this.tmbService.getBusStopConn(codiParada);
    let content: string = "";
    let files = 0;
    if (!!liniesBus && Array.isArray(liniesBus) && liniesBus.length > 0) {
      let strLiniesBus = '<ion-icon size="large" src="/assets/icon/Bus_Barcelona.svg"></ion-icon> ';
      for (let line of liniesBus) {
        strLiniesBus += `<a onclick='callAngularClickParadaLinia(${codiParada},${line.CODI_LINIA},"${line.NOM_LINIA}")'>`;
        strLiniesBus += `<ion-badge style="--color:white;--background:#${line.COLOR_LINIA}">${line.NOM_LINIA}</ion-badge></a>&nbsp;`;
      }
      content += `<div>${strLiniesBus}</div>`;
      files++;
    }
    if (!!liniesTram && Array.isArray(liniesTram) && liniesTram.length > 0) {
      let strLiniesTram = '<ion-icon size="large" src="/assets/icon/Tramvia_metropolita.svg"></ion-icon>&nbsp; ';
      for (let line of liniesTram) {
        strLiniesTram += `<ion-badge style="--color:white;--background:#${line.COLOR_LINIA}">${line.NOM_LINIA}</ion-badge>&nbsp;`;
      }
      content += `<div>${strLiniesTram}</div>`;
      files++;
    }
    if (!!liniesMetro && Array.isArray(liniesMetro) && liniesMetro.length > 0) {
      let strLiniesMetro = '<ion-icon size="large" src="/assets/icon/Metro_Barcelona.svg"></ion-icon>&nbsp; ';
      for (let line of liniesMetro) {
        strLiniesMetro += `<ion-badge style="--color:white;--background:#${line.COLOR_LINIA}">${line.NOM_LINIA}</ion-badge>&nbsp;`;
      }
      content += `<div>${strLiniesMetro}</div>`;
      files++;
    }
    if (!!liniesFGC && Array.isArray(liniesFGC) && liniesFGC.length > 0) {
      let strLiniesFGC = '<ion-icon size="large" src="/assets/icon/FGC.svg"></ion-icon>&nbsp; ';
      for (let line of liniesFGC) {
        strLiniesFGC += `<ion-badge style="--color:white;--background:#${line.COLOR_LINIA}">${line.NOM_LINIA}</ion-badge>&nbsp;`;
      }
      content += `<div>${strLiniesFGC}</div>`;
      files++;
    }
    if (!!liniesRodalies && Array.isArray(liniesRodalies) && liniesRodalies.length > 0) {
      let strLiniesRodalies = '<ion-icon size="large" src="/assets/icon/Rodalies_Catalunya.svg"></ion-icon>&nbsp; ';
      for (let line of liniesRodalies) {
        strLiniesRodalies += `<ion-badge style="--color:white;--background:#${line.COLOR_LINIA}">${line.NOM_LINIA}</ion-badge>&nbsp;`;
      }
      content += `<div>${strLiniesRodalies}</div>`;
      files++;
    }
    if (!!codiInterc && codiInterc > 0) {
      const intercanvis = await this.tmbService.getBusInterconnConnPlain(codiInterc);
      content += `<h6 style="color:black">Intercanvis</h6>`;
      for (let intercanvi of intercanvis) {
        content += `<a onclick='callAngularClickInterc(${marker.position!.lat},${marker.position!.lng},${intercanvi.GEOMETRY[1]},${intercanvi.GEOMETRY[0]})'>`;
        content += `<ion-badge style="--color:white;--background:#${intercanvi.COLOR_LINIA}">${intercanvi.NOM_LINIA}</ion-badge></a>&nbsp;`;
      }
      files += 3;
    }
    const contentStart = `\
<ion-icon size="large" src="/assets/icon/Bus_Stop.svg"></ion-icon>\
<div style="height:${10+3.9*files}ex; margin:0; padding:0">\
  <a onclick='callAngularClickParada(${codiParada})'>\
  <h5>${nomParada}</h5></a>\
  <div>`
    const contentEnd = `\
  </div> \
</div>`
    infoWindow.setContent(contentStart + content + contentEnd);
    infoWindow.open(this.map, marker);
  }

  clickParada(codiParada: number) {
    console.log(`CLICK ${codiParada}`)
  }

  clickParadaLinia(codiParada: number, codiLinia: number, nomLinia: string) {
    console.log(`CLICK ${codiParada} en línia ${codiLinia} (${nomLinia})`);
  }

  clickIntercanv(lat: number, lng: number, toLat: number, toLng: number) {
    const latLng = { lat, lng };
    const toLatLng: google.maps.LatLngLiteral = { lat: toLat, lng: toLng };
    this.showPathToMarker([ latLng, toLatLng ]);
    this.map.setCenter(toLatLng);
    this.infoWindow.close();
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
 
 /*
    // Hide the glyph.
    const pinNoGlyph = new PinElement({
        glyph: '',
    });
    const markerViewNoGlyph = new AdvancedMarkerElement({
        map,
        position: { lat: 37.415, lng: -122.01 },
        content: pinNoGlyph.element,
    });
 */

  private get personIcon() {
    const content = document.createElement("div");
    content.innerHTML = `<ion-icon size="small" src="/assets/icon/person-outline.svg"></ion-icon>`
    return content;
  }

  private createYourPositionMarker(): google.maps.marker.AdvancedMarkerElement {
    const personGlyph = new google.maps.marker.PinElement({
      glyph: this.personIcon,
      glyphColor: "white",
      background: "blue"
    });
    const yourPositionMarker = new google.maps.marker.AdvancedMarkerElement({
      map: this.map,
      content: personGlyph.element,
      position: this.faisalabad
    });
    const content = yourPositionMarker.content as HTMLElement;
    content.classList.add("drop");
    return yourPositionMarker;
  }
   
  private showPathToMarker(movePlanCoordinates: [ google.maps.LatLngLiteral, google.maps.LatLngLiteral ]) {
    const lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      strokeOpacity: 1.0,
    };
    const lineDotSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1.0,
      strokeOpacity: 0.0,
    };
    console.log("path made: ", movePlanCoordinates);
    const movePlan = new google.maps.Polyline({
      path: movePlanCoordinates,
      geodesic: true,
      strokeColor: "#0000FF",
      strokeOpacity: 0,
      strokeWeight: 1.5,
      icons: [{
        icon: lineSymbol,
        offset: '100%'
      }, {
        icon: lineDotSymbol,
        offset: '0',
        repeat: '10px'
      }],
      map: this.map
    });
    this.drawStack.push(movePlan);
    setTimeout(() => { this.hidePathToMarker(); }, ShowPathEffecttimeout);
  }
  
  private hidePathToMarker() {
    console.log("path hidden");
    let polyline = this.drawStack.shift();
    polyline?.setMap(null);
    polyline = undefined;
}

  // https://stackoverflow.com/questions/24952593/how-to-add-my-location-button-in-google-maps
  addYourLocationButton(that: GmapComponent, map: google.maps.Map, marker: google.maps.marker.AdvancedMarkerElement) {
    const controlDiv = document.createElement('div');

    const firstChild = document.createElement('button');
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

    const secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'dragend', function () {
      document.getElementById('you_location_img')?.style.setProperty('background-position', '0px 0px');
    });

    firstChild.addEventListener('click', async function () {
      if (that.yourLocationVisible) {
        marker.position = that.faisalabad;
        (marker.content as HTMLElement).style.opacity = "0";
        that.yourLocationVisible = false;
      } else {
        let imgX = '0';
        const animationInterval = setInterval(function () {
          if (imgX == '-18') imgX = '0';
          else imgX = '-18';
          document!.getElementById('you_location_img')!.style.setProperty('background-position', imgX + 'px 0px');
        }, 500);
        try {
          await that.getCurrentLocation();
          marker.position = that.location;
          (marker.content as HTMLElement).style.opacity = "1";
          await that.centerOnCurrentLocation();
          clearInterval(animationInterval);
          document.getElementById('you_location_img')!.style.setProperty('background-position', '-144px 0px');
          that.yourLocationVisible = true;
        } catch {
          clearInterval(animationInterval);
          document.getElementById('you_location_img')!.style.setProperty('background-position', '0px 0px');
        }
      }
    });
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
  }

}
