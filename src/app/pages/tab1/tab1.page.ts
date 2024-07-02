import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [ MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent ]
})
export class Tab1Page {
  constructor() {}

  readonly title = "Mapa busos Barcelona";
}
