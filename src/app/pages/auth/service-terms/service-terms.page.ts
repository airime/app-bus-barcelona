import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Platform } from '@ionic/angular';
import { IonContent, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";

/* TODO: Close
  VER: https://stackoverflow.com/questions/67948883/how-do-i-close-window-from-javascript-which-was-opened-by-ionic-capacitor
*/

@Component({
  selector: 'app-service-terms',
  standalone: true,
  templateUrl: './service-terms.page.html',
  styleUrl: './service-terms.page.scss',
  imports: [IonContent, IonFab, IonFabButton, IonIcon]
})
export class ServiceTermsPage implements OnInit {

  constructor(public platform: Platform) {

  }

  ngOnInit(): void {
    if (this.platform.is('ios')) {
      App.addListener('appUrlOpen', data => {
        if (data.url.indexOf('comflymarkonline://')> -1) {
          Browser.close();
        }
      });
    }  }

  title = "Condicions del servei"

  closeClick() {
    window.location.href="customschema://";
    window.close();
  }

}

