import { Component, Input, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonIcon, IonAvatar } from "@ionic/angular/standalone";
import { MessageHubService } from '../../services/messageHub.service';
import { Subscription } from 'rxjs';
import { IErrorMessage } from '../../interfaces/IMessage';

@Component({
  standalone: true,
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss'],
  imports: [IonAvatar, IonIcon, IonTitle, IonToolbar, IonHeader]
})
export class ContentHeaderComponent  implements OnDestroy {

  @Input({ required: true }) title!: string;
  
  public loggedIn: boolean = true;
  public get hasError() { return this.errorDetected; }
  private set hasError(value: boolean) { this.errorDetected = value; }

  private subscription: Subscription;
  private errorDetected: boolean;

  constructor(private messageService: MessageHubService) { 
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
  
  ngOnDestroy(): void {
      // unsubscribe to ensure no memory leaks
      this.subscription.unsubscribe();
  }

}
