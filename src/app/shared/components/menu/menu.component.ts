import { Component, Input, OnInit, booleanAttribute } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { IonHeader, IonToolbar, IonMenuToggle, IonTitle, IonContent, IonMenuButton, IonMenu, IonButtons, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonAvatar, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { MyCustomAnimation } from '../../services/myCustom.animation';


@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonButton, IonAvatar, IonMenuToggle, IonIcon, IonItem, IonLabel,
      IonListHeader, IonList, IonButtons,  IonMenuButton, IonMenu, IonHeader, IonToolbar, 
      RouterLink, RouterLinkActive, IonTitle, IonContent ]
})
export class MenuComponent  implements OnInit {
  @Input({ required: true, transform: booleanAttribute}) loggedIn!: boolean;
  @Input({ required: true, transform: booleanAttribute}) userValidated!: boolean;
  @Input({ required: true, transform: booleanAttribute}) displayNameDefined!: boolean;
  @Input({ required: true }) pageId!: string;

  constructor(private authService: AuthService,
              private router: Router,
              private menuCtrl: MenuController,
              private navCtrl: NavController,
              private myCustomAnimation: MyCustomAnimation
  ) { }

  get profileImgUrl() { 
    const usr = this.authService.currentUser;
    return usr?.photoURL ?? null;
  }

  selected(id: string): boolean {
    return this.pageId == id;
  }

  async userProfile() {
    await this.menuCtrl.close();
    this.navCtrl.navigateRoot('/user-profile',
                                { animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  async resendVerification() {
    await this.menuCtrl.close();
    this.navCtrl.navigateRoot('/resend-verification',
                               { animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  async changePassword() {
    await this.menuCtrl.close();
    this.navCtrl.navigateRoot('/change-password',
                                 { animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  async changeEmail() {
    await this.menuCtrl.close();
    this.navCtrl.navigateRoot('/change-email',
                                 { animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  async serviceTerms($event: any) {
    // Converts the route into a string that can be used 
    // with the window.open() function
    //await this.menuCtrl.close();
    $event.stopPropagation();
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`service-terms`])
    );
    window.open(url, '_blank');
  }

  ngOnInit() {
    
  }
}
