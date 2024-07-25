import { Component, Input, OnInit, ViewChild, booleanAttribute } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonHeader, IonToolbar, IonMenuToggle, IonTitle, IonContent, IonMenuButton, IonMenu, IonButtons, IonList, IonListHeader, IonLabel, IonItem, IonIcon, IonAvatar, IonButton, IonAccordion, IonAccordionGroup } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import { AuthService } from '../../services/auth.service';
import { MyCustomAnimation } from '../../services/myCustom.animation';


@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonAccordionGroup, IonAccordion, IonButton, IonAvatar, IonMenuToggle, IonIcon, IonItem, IonLabel,
      IonListHeader, IonList, IonButtons,  IonMenuButton, IonMenu, IonHeader, IonToolbar, 
      RouterLink, RouterLinkActive, IonTitle, IonContent ]
})
export class MenuComponent  implements OnInit {
  @Input({ required: true, transform: booleanAttribute}) loggedIn!: boolean;
  @Input({ required: true, transform: booleanAttribute}) userValidated!: boolean;
  @Input({ required: true, transform: booleanAttribute}) displayNameDefined!: boolean;
  @Input({transform: booleanAttribute}) showServices: boolean = true;
  /* TODO note pageId is no longer needed!! [routerLinkActive] do the trick when you also have [routerLink] */
  /* but you need to navegate (on click) instead of using the [routerLink] to avoid multiple menu instances to be created */
  /* When multiple menu instances are created the menu stops working */
  @Input({ required: true }) pageId!: string;
  @ViewChild(RouterLinkActive) private routerLinkActive?: RouterLinkActive;
  
  constructor(private authService: AuthService,
              private router: Router,
              private menuCtrl: MenuController,
              private navCtrl: NavController,
              private myCustomAnimation: MyCustomAnimation
  ) { 
    addIcons({
      lines: 'assets/icon/lines.svg'
    });
  }

  get profileImgUrl() { 
    const usr = this.authService.currentUser;
    return usr?.photoURL ?? null;
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

  async changeEmail() {
    if (!this.userValidated) {
      await this.menuCtrl.close();
      this.navCtrl.navigateRoot('/change-email',
                                  { animated: true, animation: this.myCustomAnimation.customAnimation });
    } else {
      throw new Error("Option available only for non-validated emails.");
    }
  }

  async changePassword() {
    if (!this.userValidated || this.displayNameDefined) {
      await this.menuCtrl.close();
      this.navCtrl.navigateRoot('/change-password',
                                  { animated: true, animation: this.myCustomAnimation.customAnimation });
      } else {
        throw new Error("Option available only after setting the user display-name.");
      }
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

  async showMap() {
    await this.menuCtrl.close();
    this.navCtrl.navigateBack('/private/home/tab1',
                                 { animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  async showFavorite() {
    await this.menuCtrl.close();
    this.navCtrl.navigateBack('/private/home/tab2',
                                 { animated: true, animation: this.myCustomAnimation.customAnimation });
  }
  async showLines() {
    await this.menuCtrl.close();
    this.navCtrl.navigateBack('/private/home/tab3',
                                 { animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  async petada() {
    await this.menuCtrl.close();
    throw new Error("Aquest error s'ha generat des-del menú!!")
  }

  ngOnInit() {
    
  }
}
