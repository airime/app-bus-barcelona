import { Component, Input, OnInit, booleanAttribute } from '@angular/core';

import { IonHeader, IonToolbar, IonMenuToggle, IonTitle, IonContent, IonMenuButton, IonMenu, IonButtons, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonAvatar } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonAvatar, IonMenuToggle, IonIcon, IonItem, IonLabel,
      IonListHeader, IonList, IonButtons,  IonMenuButton, IonMenu, IonHeader, IonToolbar, 
      RouterLink, IonTitle, IonContent ]
})
export class MenuComponent  implements OnInit {
  @Input({ required: true, transform: booleanAttribute}) loggedIn!: boolean;
  @Input({ required: true, transform: booleanAttribute}) userValidated!: boolean;
  @Input({ required: true, transform: booleanAttribute}) displayNameDefined!: boolean;
  @Input({ required: true }) pageId!: string;

  constructor(private authService: AuthService) { }

  get profileImgUrl() { 
    const usr = this.authService.currentUser;
    return usr?.photoURL ?? null;
  }

  selected(id: string): boolean {
    return this.pageId == id;
  }

  ngOnInit() {
    
  }
}
