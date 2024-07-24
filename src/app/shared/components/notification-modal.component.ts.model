import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonModal, IonToolbar, IonContent, IonTitle, IonButtons, IonButton, IonItem, IonInput } from "@ionic/angular/standalone";
import { IVacanca } from 'src/app/models/interfaces';
import { HeaderComponent } from '../header/header.component';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  imports: [IonHeader, IonModal, IonToolbar, IonHeader, IonTitle, IonContent, IonButtons, IonButton, IonItem, IonInput, HeaderComponent],
  standalone: true
})
export class NotificationModalComponent {

  @Input() vacanca!: IVacanca

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

}
