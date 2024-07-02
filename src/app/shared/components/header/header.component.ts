import { Component, Input, OnDestroy, booleanAttribute } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonIcon, IonAvatar, IonChip, IonButton } from "@ionic/angular/standalone";
import { Subscription } from 'rxjs';
import { MessageHubService } from '../../services/messageHub.service';
import { IErrorMessage } from '../../interfaces/IMessage';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonButton, IonChip, IonAvatar, IonIcon, IonTitle, IonToolbar, IonHeader]
})
export class HeaderComponent implements OnDestroy {

  @Input({ required: true }) title!: string;
  @Input({ required: true, transform: booleanAttribute}) loggedIn!: boolean;
  
  public get hasError() { return this.errorDetected; }
  private set hasError(value: boolean) { this.errorDetected = value; }

  private subscription: Subscription;
  private errorDetected: boolean;

  constructor(private messageService: MessageHubService,
              private authService: AuthService) {
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

  async logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
