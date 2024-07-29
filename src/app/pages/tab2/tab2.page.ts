import { Component, OnInit } from '@angular/core';
import { IonContent, IonText, IonItem, IonButton, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, IonButton, IonItem, IonText, MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent]
})
export class Tab2Page implements OnInit {

  readonly title = "Ruta";

  data: any[] = ['kk'];

  get codiParada() { return this._codiParada; }
  get nomParada() { return this._nomParada; }
  get latLng() { return this._latLng; }

  private _codiParada!: number;
  private _nomParada!: number;
  private _latLng!: google.maps.LatLngLiteral;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    let lat: number;
    let lng: number;
    this.route.queryParams.subscribe(params => {
      this._nomParada = params['nom'] ?? "";
      this._codiParada = params['codi'] ?? 0;
      lat = params['lat'] ?? 0;
      lng = params['lng'] ?? 0;
      this._latLng = { lat: lat, lng: lng };
    }
    );
    console.log(this.codiParada, this.nomParada, this.latLng);
  }


}
