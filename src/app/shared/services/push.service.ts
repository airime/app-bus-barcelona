import { Injectable } from '@angular/core';
import { PushNotificationSchema, PushNotifications, ActionPerformed, Token } from '@capacitor/push-notifications';
import { AuthService } from './auth.service';
import { ModalController } from '@ionic/angular/standalone';
import { toErrorWithMessage } from '../util/errors';
import { IPushNotification } from '../interfaces/IPushNotification';
import { NotificationModalComponent } from '../components/notification-modal/notification-modal.component';
import { INamedPlace } from '../interfaces/INamedPlace';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private authService: AuthService,
              private modalCtrl: ModalController) { }

  async addListeners() {
    await PushNotifications.addListener('registration', async (token: Token) => {
      console.info('PUSH registration token: ', token.value);
      await this.authService.setUserPushToken(token.value);
    });

    await PushNotifications.addListener('registrationError', (err: any) => {
      console.error('PUSH registration error: ', err.error);
      throw toErrorWithMessage(err);
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification: IPushNotification) => {
      console.log('PUSH Push notification action performed', JSON.stringify(notification));
      const info: INamedPlace = {
        textInfo: notification.notification.data.textInfo,
        latLng: { lat: notification.notification.data.lat, lng: notification.notification.data.lng },
        locationType: notification.notification.data.locationType,
        operator: notification.notification.data.operator,
        locationName: notification.notification.data.locationName,
      }
      console.log('notification info: ', info);
      this.openModal(info);
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
    console.log('delivered notifications', notificationList);
  }

  async openModal(info: INamedPlace) {
    const modal = await this.modalCtrl.create({
      component: NotificationModalComponent,
      componentProps: { info }
    });
    modal.present();
  }


}
