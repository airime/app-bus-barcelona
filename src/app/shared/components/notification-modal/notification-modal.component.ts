import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonModal, IonToolbar, IonContent, IonTitle, IonButtons, IonButton, IonItem, IonInput } from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular/standalone';
import { INamedPlace } from '../../interfaces/INamedPlace';
import { IPositionMessage } from '../../interfaces/IMessage';
import { MessageHubService } from '../../services/messageHub.service';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  imports: [IonHeader, IonModal, IonToolbar, IonHeader, IonTitle, IonContent, IonButtons, IonButton, IonItem, IonInput],
  standalone: true
})
export class NotificationModalComponent implements OnInit {
  @Input() place!: INamedPlace

  constructor(private modalCtrl: ModalController,
              private messageService: MessageHubService) { }

  ngOnInit(): void {
    const message = {
      tag: "position",
      content: this.place.latLng
    } as IPositionMessage;
    console.log("Message", message.content);
    this.messageService.sendMessage(message);
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}





