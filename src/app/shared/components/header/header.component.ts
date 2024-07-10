import { Component, Input, OnDestroy } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuToggle, IonMenuButton, IonButton, IonTitle, IonIcon, IonAvatar, IonChip } from "@ionic/angular/standalone";

import { MenuComponent } from '../menu/menu.component';
import { Subscription } from 'rxjs';
import { MessageHubService } from '../../services/messageHub.service';
import { IErrorMessage } from '../../interfaces/IMessage';
import { AuthService } from '../../services/auth.service';
import { MyCustomAnimation } from '../../services/myCustom.animation';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MenuComponent, IonMenuToggle, IonButtons, IonMenuButton, IonButton, IonChip, IonAvatar, IonIcon, IonTitle, IonToolbar, IonHeader]
})
export class HeaderComponent implements OnDestroy {

  @Input({ required: true }) title!: string;
  
  public get hasError() { return this.errorDetected; }
  private set hasError(value: boolean) { this.errorDetected = value; }

  private subscription: Subscription;
  private errorDetected: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private menuCtrl: MenuController,
              private navCtrl: NavController,
              private messageService: MessageHubService,
              private authService: AuthService,
              private myCustomAnimation: MyCustomAnimation) {
      this.errorDetected = false;
      // subscribe to home component messages
      this.subscription = this.messageService.onMessage().subscribe(message => {
        if (message.tag == "error") {
          const errMessage = message as IErrorMessage;
          this.hasError = true;
        } else if (message.tag == "dismissError") {
          this.hasError = false;
        }
      });
  }

  public get showMenu(): boolean {
    return this.authService.currentUser?.emailVerified ?? false;
  }

  public get userUrlImage() { 
    return (this.authService.currentUser?.photoURL ?? null)?? "./assets/person-outline.svg";
  }

  async userProfile() {
    await this.menuCtrl.close();
    this.navCtrl.navigateRoot('/user-profile',
                                { animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  async logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
