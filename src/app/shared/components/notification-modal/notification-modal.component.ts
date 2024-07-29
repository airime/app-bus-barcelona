import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonModal, IonToolbar, IonContent, IonTitle, IonButtons, IonButton, IonItem, IonInput, IonImg } from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular/standalone';
import { INamedPlace } from '../../interfaces/INamedPlace';
import { IPositionMessage } from '../../interfaces/IMessage';
import { MessageHubService } from '../../services/messageHub.service';
import { toINamedPlace, toLatLng } from '../../model/transforms';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  imports: [IonImg, IonHeader, IonModal, IonToolbar, IonHeader, IonTitle, IonContent, IonButtons, IonButton, IonItem, IonInput],
  standalone: true
})
export class NotificationModalComponent implements OnInit {
  @Input({ required: true }) title!: string;
  @Input({ required: true, transform: toINamedPlace }) set place(value: INamedPlace) { this._place = value; };
  //@Input({ required: true, transform: toLatLng }) set latLng(value: google.maps.LatLngLiteral) { this._latLng = value; };
  @Input() urlImage?: string;
  @Input() subtitle?: string;

  public get place(): INamedPlace { return this._place; }
  //public get latLng(): google.maps.LatLngLiteral { return this._latLng; }
  private _place!: INamedPlace;
  private _latLng!: google.maps.LatLngLiteral;

  constructor(private modalCtrl: ModalController,
              private messageService: MessageHubService) { }

  ngOnInit(): void {
    try {
      console.log("Title: ", this.title);
      console.log("Place: ", this.place);
      //console.log("LatLng: ", this.latLng);
      console.log("Url image: ", this.urlImage);      
      console.log("Subtitle: ", this.subtitle);
      const message = {
        tag: "position",
        content: this._latLng
      } as IPositionMessage;
      console.log("Message", message.content);
      this.messageService.sendMessage(message);
    } catch(err)  {
      console.log(err);
    }
  }

  get altImage(): string {
    return this.title;
  }

  get latLng(): google.maps.LatLngLiteral {
    return this._place.latLng;
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}





