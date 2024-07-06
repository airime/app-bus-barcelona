import { Component, Input, OnDestroy, booleanAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonButton, IonTitle, IonIcon, IonAvatar } from "@ionic/angular/standalone";
import { MessageHubService } from '../../services/messageHub.service';
import { Subscription } from 'rxjs';
import { IErrorMessage } from '../../interfaces/IMessage';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss'],
  imports: [IonButtons, IonMenuButton, IonButton, IonAvatar, IonIcon, IonTitle, IonToolbar, IonHeader]
})
export class ContentHeaderComponent  implements OnDestroy {

  @Input({ required: true }) title!: string;
  @Input({ required: true, transform: booleanAttribute }) loggedIn!: boolean;
  @Input({ required: true, transform: booleanAttribute}) userValidated!: boolean;
  
  public get hasError() { return this.errorDetected; }
  private set hasError(value: boolean) { this.errorDetected = value; }


  private subscription: Subscription;
  private errorDetected: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageHubService,
              private authService: AuthService)
  { 
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
  
  public get userUrlImage() { return (this.loggedIn? this.authService.currentUser?.photoURL ?? null : null)?? "./assets/person-outline.svg" }

  userProfile() {
    this.router.navigate(['/','user-profile']);
  }

  async logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
      // unsubscribe to ensure no memory leaks
      this.subscription.unsubscribe();
  }

}
