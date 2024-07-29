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
    this.authService.refreshCurrentUser()
      .then(usrProfile => this.currentUser = usrProfile)
      .then(async () => { if (!!this.currentUser) { this.pushService.setUserToken(); } });
    addIcons({ mapOutline, starOutline });
    addIcons({
      lines: 'assets/icon/lines.svg'
    });
  }

  ngOnInit(): void {
  }

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }

}
