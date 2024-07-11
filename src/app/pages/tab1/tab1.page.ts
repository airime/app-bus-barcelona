import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';
import { GmapComponent } from '../../shared/components/gmap/gmap.component';


@Component({
  selector: 'app-tab1',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent, GmapComponent ]
})
export class Tab1Page {
  readonly title = "Mapa busos Barcelona";

}
