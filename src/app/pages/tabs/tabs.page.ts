import { AfterViewInit, Component, EnvironmentInjector, OnInit, ViewChild, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mapOutline, starOutline } from 'ionicons/icons';
import { MenuComponent } from "../../shared/components/menu/menu.component";
import { userProfile } from 'src/app/shared/model/userProfile';
import { AuthService } from 'src/app/shared/services/auth.service';
import { isNullOrEmpty } from 'src/app/shared/util/util';
import { PushService } from 'src/app/shared/services/push.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, MenuComponent],
})
export class TabsPage implements OnInit {
  @ViewChild("mainTabs") mainTabs!: IonTabs;
  public environmentInjector = inject(EnvironmentInjector);

  private currentUser!: userProfile | null;

  constructor(
    private authService: AuthService,
    private pushService: PushService
  ) {
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
    addIcons({ mapOutline, starOutline });
    addIcons({
      lines: 'assets/icon/lines.svg'
    });
  }

  ngOnInit(): void {
    if (Capacitor.isPluginAvailable('PushNotifications')) {
      try {
        this.pushService.registerNotifications();
        this.pushService.addListeners();
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("PushNotifications plugin not available. Service: ", this.pushService);
    }
  }

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }

}
