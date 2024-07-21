import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';
import { GmapComponent } from '../../shared/components/gmap/gmap.component';
import { MessageHubService } from 'src/app/shared/services/messageHub.service';
import { Subscription } from 'rxjs';
import { IPositionMessage } from 'src/app/shared/interfaces/IMessage';


@Component({
  selector: 'app-tab1',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent, GmapComponent ]
})
export class Tab1Page {
  @ViewChild("map") map!: GmapComponent;

  readonly title = "Mapa busos Barcelona";
  private subscription: Subscription;

  constructor(private messageService: MessageHubService) {
    // subscribe to messages
    this.subscription = this.messageService.onMessage().subscribe(message => {
      if (message.tag == "position") {
        this.map.center = (<IPositionMessage>message).content;
      }
    });
  }

  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
