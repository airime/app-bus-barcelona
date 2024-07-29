import { Component, Input, ViewChild, booleanAttribute } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController } from '@ionic/angular';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonHeader, IonToolbar, IonMenuToggle, IonTitle, IonContent,
  IonMenuButton, IonMenu, IonButtons, IonList, IonListHeader, IonLabel,
  IonItem, IonIcon, IonAvatar, IonButton, IonAccordion, IonAccordionGroup,
  IonInput, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import { AuthService } from '../../services/auth.service';
import { MessageHubService } from '../../services/messageHub.service';
import { MyCustomAnimation } from '../../services/myCustom.animation';
import { defaultShowPathEffecttimeout, IConfigShowTimeoutMessage } from '../../interfaces/IMessage';


@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonText, IonAccordionGroup, IonAccordion, IonButton, IonAvatar, IonMenuToggle, IonIcon, IonItem, IonLabel,
    IonListHeader, IonList, IonButtons, IonMenuButton, IonMenu, IonHeader, IonToolbar,
    RouterLink, RouterLinkActive, IonTitle, IonContent,
    ReactiveFormsModule, IonInput]
})
export class MenuComponent {
  @Input({ required: true, transform: booleanAttribute }) loggedIn!: boolean;
  @Input({ required: true, transform: booleanAttribute }) userValidated!: boolean;
  @Input({ required: true, transform: booleanAttribute }) displayNameDefined!: boolean;
  @Input({ transform: booleanAttribute }) showServices: boolean = true;
  /* TODO note pageId is no longer needed!! [routerLinkActive] do the trick when you also have [routerLink] */
  /* but you need to navegate (on click) instead of using the [routerLink] to avoid multiple menu instances to be created */
  /* When multiple menu instances are created the menu stops working */
  @Input({ required: true }) pageId!: string;
  @ViewChild(RouterLinkActive) private routerLinkActive?: RouterLinkActive;

  showTimeoutForm: FormGroup;
  private _showTimeout: number;
  private prev_showTimeout: number;
  private showTimeout_setValue: number;

  constructor(private authService: AuthService,
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private messageService: MessageHubService,
    private myCustomAnimation: MyCustomAnimation
  ) {
    addIcons({
      lines: 'assets/icon/lines.svg'
    });
    this._showTimeout = defaultShowPathEffecttimeout / 1000;
    this.prev_showTimeout = this._showTimeout;
    this.showTimeout_setValue = this._showTimeout;
    this.showTimeoutForm = new FormGroup({
      showTimeout: new FormControl(this._showTimeout,
        [Validators.required, Validators.min(1), Validators.max(999), Validators.pattern("^[0-9]*$")]),
    });
  }

  menuClosed() {
    console.log("menu closed");
    this.showTimeoutForm.patchValue({ "showTimeout": this.showTimeout_setValue });
  }

  get pushNotificationsAvailable(): boolean {
    return Capacitor.isPluginAvailable('PushNotifications');
  }

  get profileImgUrl() {
    const usr = this.authService.currentUser;
    return usr?.photoURL ?? null;
  }

  get showTimeout() { return this._showTimeout; }
  set showTimeout(value: number) {
    this._showTimeout = value;
    this.prev_showTimeout = value;
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
      throw new Error("Option available only after setting the user display-name (and also before validate email).");
    }
  }

  /* controla el valor numeric de showTimeout en IonInput */
  async showingOnInput($event: any) {
    if (this.showTimeoutForm.valid) {
      this.showTimeout = $event.detail.value;
    } else {
      $event.target.value = this.prev_showTimeout;
      this.showTimeoutForm.patchValue({ "showTimeout": this.prev_showTimeout });
      this.showTimeout = this.prev_showTimeout;
    }
  }

  /* estableix el valor de showTimeout */
  async setShowTimeout() {
    if (this.showTimeoutForm.valid) {
      const message = {
        tag: "configShowTimeout",
        content: this.showTimeout * 1000
      } as IConfigShowTimeoutMessage;
      console.log("Message: ", message);
      this.messageService.sendMessage(message);
      this.showTimeout_setValue = this.showTimeout;
    } else {
      // sempre ha de ser vàlid
      throw new Error("Detectat valor invalid");
    }
  }

  /* Notificacions rebudes en tant que l'app no hi era activa */
  async showNotifications() {
    if (this.pushNotificationsAvailable) {
      this.router.navigate(['/private/pushlist']);
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

}
