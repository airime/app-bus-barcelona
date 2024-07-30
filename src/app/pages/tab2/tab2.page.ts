import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonText, IonItem, IonSelect, IonSelectOption, IonButton, IonToolbar, IonTitle, IonList, IonHeader, IonBadge, IonIcon } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';
import { TmbService } from 'src/app/shared/services/tmb.service';
import { IItinerari, IEtapa, ModeEtapa, convertPlan, descriuItinerari, textModeEtapa, IShareableData, modesItinerari } from 'src/app/shared/interfaces/IItinerari';
import { INamedPlace } from 'src/app/shared/interfaces/INamedPlace';
import { formatAMPM } from 'src/app/shared/util/util';
import { toErrorWithMessage } from 'src/app/shared/util/errors';
import { ShareDataComponent } from 'src/app/shared/components/share-data/share-data.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonIcon, IonBadge, IonHeader, IonList, IonTitle, IonToolbar, IonButton, IonItem, IonText, IonSelect, IonSelectOption,
    MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent]
})
export class Tab2Page implements OnInit {

  readonly title = "Ruta";

  get codiParada() { return this._codiParada; }
  get nomParada() { return this._nomParada; }
  get fromLatLng() { return this._fromLatLng; }
  get latLng() { return this._latLng; }

  private _codiParada!: number;
  private _nomParada!: string;
  private _fromLatLng!: google.maps.LatLngLiteral;
  private _latLng!: google.maps.LatLngLiteral;
  private itineraris!: IItinerari[];
  private _itinerariSelected: number = -1;
  private _it?: IItinerari;

  public descripcio_itineraris!: string[];

  get isItinerariSelected(): boolean {
    return this._itinerariSelected >= 0;
  }

  get it(): IItinerari | undefined {
    return this._it;
  }

  public strDuration(seconds: number): string {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return (hours > 0 ? hours.toString() + 'h ' : '') + minutes.toString() + "'" + seconds.toString() + '"';
  }

  public strTime(value: number): string {
    let date = new Date(value);
    return formatAMPM(date);
  }

  constructor(
    private route: ActivatedRoute,
    private tmbService: TmbService,
    private authService: AuthService,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit(): void {
    let fromLat: number;
    let fromLng: number;
    let lat: number;
    let lng: number;
    this.route.queryParams.subscribe(params => {
      this._nomParada = params['nom'] ?? "";
      this._codiParada = params['codi'] ?? 0;
      fromLat = params['fromLat'] ?? 0;
      fromLng = params['fromLng'] ?? 0;
      lat = params['lat'] ?? 0;
      lng = params['lng'] ?? 0;
      this._fromLatLng = { lat: fromLat, lng: fromLng };
      this._latLng = { lat: lat, lng: lng };
    }
    );
  }

  ionViewWillEnter() {
    console.log(this.codiParada, this.nomParada, this.latLng);
    this._itinerariSelected = -1;
    this.descripcio_itineraris = [];
    let date = new Date();
    {
      let ms = date.getTime() + (60 * 60 * 12) * 1000;
      var tomorrow = new Date(ms);
    }
    this.tmbService.getPlan(tomorrow, this.fromLatLng, this.latLng).subscribe((result: any) => {
      this.itineraris = convertPlan(result.plan.itineraries);
      console.log("itineraries", this.itineraris);
      this.descripcio_itineraris = [];
      this.itineraris.forEach(it => { this.descripcio_itineraris.push(descriuItinerari(it)); })
      if (this.itineraris.length > 0) {
        console.log(descriuItinerari(this.itineraris[0]));
      }
    });
  }

  itinerariSelect($event: any) {
    this._itinerariSelected = $event.detail.value;
    this._it = this.itineraris[this._itinerariSelected!]
  }

  cssBadgeLinia(color: string): string {
    return `--color:white;--background:#${color}`;
  }

  textModeEtapa(value: ModeEtapa) { return textModeEtapa(value); }

  async shareData() {
    if (!!this.it) {
      const date = new Date(this.it.endTime);
      const share: IShareableData = {
        place: { info: this._nomParada, latLng: this._latLng },
        mode: modesItinerari(this.it),
        arrivalTime: formatAMPM(date)
      };
      const title = `llegada a ${share.place.info}`;
      const text = `Llegada esperada de ${this.authService.currentUser?.displayName}` +
        ` a ${share.place.info} a las ${share.arrivalTime}.` +
        ` Coordenadas [ ${share.place.latLng.lat}, ${share.place.latLng.lng} ].` +
        ` (${share.mode})`;
      const dialogTitle = "Compartir llegada";
      let capacitorPlugin: boolean = Capacitor.isPluginAvailable('Share');
      try {
        if (capacitorPlugin) {
          await Share.share({
            title: title,
            text: text,
            dialogTitle: dialogTitle
          });
        } else {
          throw new Error("Share API not available.")
        }
      } catch (err) {
        let theErr = toErrorWithMessage(err);
        if (theErr.message.startsWith("Share API")) capacitorPlugin = false;
      }
      if (!capacitorPlugin) {
        console.log("ALERNATIVE TO PLUGIN");
        const modal = await this.modalCtrl.create({
          component: ShareDataComponent,
          componentProps: {
            title: title,
            text: text,
            dialogTitle: dialogTitle
          }
        });
        await modal.present();
      }
    } else {
      console.log("this.it: ", this.it);
    }
  }

}
