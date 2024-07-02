import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonMenuButton, IonMenu } from '@ionic/angular/standalone';


@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [ IonMenuButton, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent ]
})
export class MenuComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
