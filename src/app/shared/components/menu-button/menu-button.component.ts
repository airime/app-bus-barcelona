import { Component, OnInit } from '@angular/core';
import { IonButtons, IonMenuButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-menu-button',
  standalone: true,
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
  imports: [IonButtons, IonMenuButton]
})
export class MenuButtonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
