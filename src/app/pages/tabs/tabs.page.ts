import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mapOutline, starOutline } from 'ionicons/icons';
import { MenuComponent } from "../../shared/components/menu/menu.component";
import { userProfile } from 'src/app/shared/model/userProfile';
import { AuthService } from 'src/app/shared/services/auth.service';
import { isNullOrEmpty } from 'src/app/shared/util/util';
import { PushService } from 'src/app/shared/services/push.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, MenuComponent],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  private currentUser!: userProfile | null;

  constructor(
    private authService: AuthService,
    private pushService: PushService
  ) {
    this.pushService.registerNotifications();
    this.pushService.addListeners();
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
    addIcons({mapOutline, starOutline });
    addIcons({
      lines: 'assets/lines.svg'
    });
  }

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }

}
