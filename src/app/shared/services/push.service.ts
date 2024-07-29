import { Injectable } from '@angular/core';
import { PushNotificationSchema, PushNotifications, ActionPerformed, Token, DeliveredNotifications } from '@capacitor/push-notifications';
import { AuthService } from './auth.service';
import { ModalController } from '@ionic/angular/standalone';
import { toErrorWithMessage } from '../util/errors';
import { IPushNotificationData } from '../interfaces/IPushNotification';
import { NotificationModalComponent } from '../components/notification-modal/notification-modal.component';
import { INamedPlace } from '../interfaces/INamedPlace';
import { Toast } from '@capacitor/toast';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  private notifications: IPushNotificationData[];

  public get storedNotifications(): IPushNotificationData[] {
    return this.notifications;
  }

  constructor(private localStorageService: LocalStorageService,
              private authService: AuthService,
              private modalCtrl: ModalController) {
    this.notifications = [];
  }

  async addListeners() {
    await PushNotifications.addListener('registration', async (token: Token) => {
      console.info('PUSH registration token: ', token.value);
      await this.localStorageService.setUserToken(token.value);
    });

    await PushNotifications.addListener('registrationError', (err: any) => {
      console.error('PUSH registration error: ', err.error);
      throw toErrorWithMessage(err);
    });

    await PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotificationSchema) => {
      this.notifications.push(notification.data);
      console.log('Push notification received: ', this.notifications);
      await Toast.show({ text: notification.title?? notification.data.title, duration: 'long' });
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', async (notification: ActionPerformed) => {
      console.log('PUSH Push notification action performed', notification);
      this.openModal(notification.notification.data);
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

  async setUserToken() {
    let token = await this.localStorageService.getUserToken();
    if (!!token) {
      await this.authService.setUserPushToken(token);
      console.log("user token set");
    } else {
      console.log("No token found to use for push notifications.");
    }
  }

  async getDeliveredNotifications(): Promise<IPushNotificationData[]> {
    await this.pushDeliveredNotifications();
    return this.notifications;
  }

  async openModal(notificationData: IPushNotificationData) {
    console.log("Notification to show: ", notificationData);
    const place: INamedPlace = {
      info: notificationData.info,
      latLng: <google.maps.LatLngLiteral>{
        lat: parseFloat(notificationData.lat),
        lng: parseFloat(notificationData.lng),
      },
      locationType: notificationData.locationType,
      operator: notificationData.operator,
      locationName: notificationData.locationName,
    };
    const modal = await this.modalCtrl.create({
      component: NotificationModalComponent,
      componentProps: { title: notificationData.title,
                        subtitle: notificationData.subtitle,
                        place: place,
                        urlImage: notificationData.image }
    });
    await modal.present();
  }

  private async pushDeliveredNotifications() {
    const { notifications } = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications to push: ', notifications);
    if (notifications.length > 0) {
      while (notifications.length > 0) {
        this.notifications.push(notifications.shift()?.data);
      }
      await PushNotifications.removeAllDeliveredNotifications();
    }
  }


}
