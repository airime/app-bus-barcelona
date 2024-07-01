import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonMenu, IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonList, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton, IonMenu]
})
export class Tab1Page {
  constructor() {}
}
