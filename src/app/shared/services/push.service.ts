import { Injectable } from '@angular/core';
import { PushNotificationSchema, PushNotifications, ActionPerformed, Token } from '@capacitor/push-notifications';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private authService: AuthService) { }

  async addListeners() {
    await PushNotifications.addListener('registration', (token: Token) => {
      console.info('Registration token: ', token.value);
      this.authService.setUserPushToken(token.value);
    });

    await PushNotifications.addListener('registrationError', (err: any) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive !== 'granted') {
      //NOTE - Rebuig de permisos
      // ? segur un throw?
      throw new Error('User denied permissions!');
    }
    await PushNotifications.register();
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }


}
