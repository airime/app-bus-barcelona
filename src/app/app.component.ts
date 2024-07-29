import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushService } from './shared/services/push.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private pushService: PushService) {}

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

}
