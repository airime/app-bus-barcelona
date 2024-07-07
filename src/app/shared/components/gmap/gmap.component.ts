import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit, numberAttribute } from '@angular/core';
import { IonPopover }  from '@ionic/angular/standalone'; 
import { Capacitor } from '@capacitor/core';
import { GoogleMap } from '@capacitor/google-maps';
import { Geolocation, PermissionStatus, CallbackID } from '@capacitor/geolocation';
import { LatLng, Marker } from '@capacitor/google-maps/dist/typings/definitions';

import { googleMapsApiKey, googleMapId } from '../../../api.key';
import { PredefinedGeoPositions, geoPlaces } from '../../util/predefinedGeoPlaces';

@Component({
  standalone: true,
  selector: 'app-gmap',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss'],
  imports: [ IonPopover ]
})
export class GmapComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) appId!: string;
  @Input({ transform: numberAttribute }) set latitude(value: number) {
    this.location.lat = value;
  }
  @Input({ transform: numberAttribute }) set longitude(value: number) {
    this.location.lat = value;
  }
  @ViewChild('popover') popover?: IonPopover;
  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;

  get latitude() : number {
    return this.location.lat;
  }
  get longitude() : number {
    return this.location.lng;
  }

get markerIsOpen(): boolean { return !!this.markerId; }
closeMarker() { this.markerId = undefined; }



  private location: LatLng;
  private newMap!: GoogleMap;
  private watchId?: CallbackID;

  /* TODO payment feature */
  private mapId?: string;

  private markerId?: string;
  private markers: { [id: string]: Marker } = {};

  get markerTitle(): string | undefined {
    return this.markerId? this.markers[this.markerId].title : undefined;
  }

  markerInfo(): string {
    return `<div> \
    </div>`
  }


  constructor() {
    /* TODO read initial coordinates from user preferences? */
    this.location = PredefinedGeoPositions[geoPlaces.BarcelonaCenter];
    /*
      ERROR: App.getInfo() not implemented for Web; introduced as an @Input parameter to avoid error
      if (Capacitor.getPlatform() != 'web') {
        App.getInfo()
          .then(x => { this.appId = x.id; this.appName = x.name; console.log(`AppId: ${this.appId} Name: ${this.appName}`); })
          .catch(err => console.log("App.getInfo error:", err));
      }
    */
  }

  ngOnInit(): void {
    // GEOPOSITION TIMESOUT
    // this.getPosition();
    //this.coordinates = await this.getPosition();

    //   Geolocation.checkPermissions()
  //   .then(geoPosPermision => {
  //     console.log("geoPosPermision: ", geoPosPermision.location, geoPosPermision.coarseLocation);
  //     if (geoPosPermision.location === 'granted' || geoPosPermision.coarseLocation === 'granted')
  //     {
  //       Geolocation.watchPosition(
  //           {
  //             enableHighAccuracy: (geoPosPermision.location === 'granted'),
  //             timeout: 15000,
  //             maximumAge: 16000,
  //           },
  //           pos => { 
  //             if (!!pos) {
  //               this.coordinates = { lat: pos.coords.latitude, lng: pos.coords.longitude };
  //               console.log("position;", this.coordinates);
  //             };
  //           })
  //           .then(id => { this.watchId = id; } )
  //           .catch(reason => console.log("Setup position observer failed: ", reason));
  //     }
  //   })
  //   .catch(err => console.log("Geolocation.watchPosition ERROR: ", err));
  }

  private async getPosition(): Promise<LatLng> {
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
      }
      else {
        this.location = PredefinedGeoPositions[geoPlaces.BarcelonaCenter];
        console.log("Not granted??");
      }
    } catch(err) {
      console.log("Geolocation error: ", err);
      this.location = PredefinedGeoPositions[geoPlaces.BarcelonaCenter];
    };
    return this.location;
  }

  ngAfterViewInit(): void {
    console.debug("OUTER HTML",this.mapRef?.nativeElement?.outerHTML)
    this.createMap();
  }
  
  async createMap(): Promise<void> {
    /* TODO use environtment for apiKey? */
    try {
      const location = await this.getPosition();
      this.newMap = await GoogleMap.create({
          id: googleMapId, // this.appId,
          element: this.mapRef.nativeElement,
          apiKey: googleMapsApiKey,
          config: {
            center: location,
            zoom: 17,
            zoomControl: false,
            streetViewControl: false,
            //disableDefaultUI: true
          },
        },
        (mapIdResult) => { this.mapId = mapIdResult.mapId; console.log("MAP-ID: ", mapIdResult)});
        /* CALLBACK NOT WORKING (maybe there is not MapId? ) */
        console.log("CREATE-MAP CALLED: ", this.location);
      this.mapInitialActions();
    } catch(err) {
      console.log(err);
      throw(err);
    }
  }

  async mapInitialActions(): Promise<void> {
    await this.newMap.disableTouch();
    this.newMap.disableScrolling();
    if (Capacitor.getPlatform() != 'web') {
      /* features not available on web */
      await this.newMap.enableIndoorMaps(false);
      await this.newMap.enableAccessibilityElements(true);
    }
    await this.newMap.enableTrafficLayer(true).then(() => { console.log("enableTrafficLayer"); });
    this.mapRef.nativeElement.classList.add('show-map');
    //await newMap.setOnMarkerClickListener((event) => {});
    this.newMap.setOnMapClickListener(async (t) => { this.addMarker(t.latitude, t.longitude); });

    this.newMap.setOnMarkerClickListener((t) => {      
      console.log("setOnMarkerClickListener", t)
     });

    // pending fuctionalities:
    //await this.newMap.setCamera
    // enableCurrentLocation? Maybe not needed if the map can't be moved
    // await this.newMap.enableCurrentLocation(true).then(() => {
    //   console.log("enableCurrentLocation");
    // });    

    /* no changes observed */
    this.newMap.enableClustering(2);
    this.newMap.setOnClusterClickListener((t) => { console.log("setOnClusterClickListener", t) });
    this.newMap.setOnClusterInfoWindowClickListener((t) => { console.log("setOnClusterInfoWindowClickListener", t) });
    this.newMap.setOnInfoWindowClickListener((t) => { console.log("setOnInfoWindowClickListener", t) });
    this.newMap.setOnMyLocationButtonClickListener((t) => { console.log("setOnMyLocationButtonClickListener", t) });
    this.newMap.setOnMyLocationClickListener((t) => { console.log("setOnMyLocationClickListener", t) });

    //prova marker (¿?)
    console.log("marker:", this.location);
    await this.addMarker(this.location.lat, this.location.lng);
  }

  async addMarker(lat: number, lng: number): Promise<void> {
    const newMarker: Marker = 
      {
        coordinate: { lat: lat, lng: lng },
        opacity: 1,
        title: "Hola",
        snippet: `<div>Això és una <b>informació</b> addicional.</div>`
      };
    const id = await this.newMap.addMarker(newMarker);
    this.markers[id] = newMarker;
  }

  async ngOnDestroy(): Promise<void> {
    if (!!this.watchId) await Geolocation.clearWatch({ id: this.watchId });
    if (!!this.newMap) await this.newMap.destroy();
  }

}
