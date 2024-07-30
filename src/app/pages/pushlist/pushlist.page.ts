import { Component,  OnInit } from '@angular/core';
import { IonContent, IonList, IonItem, IonIcon, IonLabel, IonNote } from '@ionic/angular/standalone';
import { Location, I18nPluralPipe } from '@angular/common';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { userProfile } from 'src/app/shared/model/userProfile';
import { isNullOrEmpty } from 'src/app/shared/util/util';
import { IPushNotificationData } from 'src/app/shared/interfaces/IPushNotification';
import { PushService } from 'src/app/shared/services/push.service';


@Component({
  selector: 'app-pushlist',
  standalone: true,
  templateUrl: 'pushlist.page.html',
  styleUrls: ['pushlist.page.scss'],
  imports: [MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent, I18nPluralPipe, IonList, IonItem, IonIcon, IonLabel, IonNote]
})
export class PushListPage implements OnInit {
  readonly title = "Llista de notificacions push";

  public notifications: IPushNotificationData[] = [];

  private currentUser!: userProfile | null;

  pluralMapping = {
    '=0' : 'No hi ha notificacions',
    '=1' : 'Mostrant 1 notificació',
    'other' : 'Mostrant # notificacions'
  }

  constructor(
    private pushService: PushService,
    private location: Location,
    private authService: AuthService
  ) {
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
  }

  async ngOnInit(): Promise<void> {
    this.notifications = await this.pushService.getDeliveredNotifications();
    console.log('received notifs', this.notifications);
  }

  goBack(): void {
    this.location.back();
  }

  openModal(i: number): void {
    console.log(this.notifications[i].title);
    this.pushService.openModal(this.notifications[i]);
  }

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }

}
