import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { IPushNotification, IVacanca } from '../models/interfaces';
import { ModalController } from '@ionic/angular/standalone';
import { NotificationModalComponent } from '../shared/notification-modal/notification-modal.component';
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private modalCtrl: ModalController,
              private userService: UserService) { }

  async addListeners() {
    await PushNotifications.addListener('registration', token => {
      console.info('PUSH Registration token: ', token.value);
      this.userService.setUserPushToken(token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('PUSH Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('PUSH Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification: IPushNotification) => {
      console.log('PUSH Push notification action performed', JSON.stringify(notification));
      const vacanca: IVacanca = {
        id: notification.notification.data.id,
        nom: notification.notification.data.nom,
        descripcio: notification.notification.data.descripcio,
        actiu: notification.notification.data.actiu === 'true',
        preu: +notification.notification.data.preu,
      }
      console.log('vacanca', vacanca);
      this.openModal(vacanca);
    });
  }

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('PUSH delivered notifications', JSON.stringify(notificationList.notifications));
  }

  async openModal(vacanca: IVacanca) {
    const modal = await this.modalCtrl.create({
      component: NotificationModalComponent,
      componentProps: {
        vacanca
      }
    });
    modal.present();
  }

}

