import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton, IonMenu, IonButtons } from '@ionic/angular/standalone';


@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonButtons,  IonMenuButton, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent ]
})
export class MenuComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
