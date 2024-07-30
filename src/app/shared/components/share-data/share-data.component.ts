import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from  '@ionic/angular/standalone';
import { Clipboard } from '@capacitor/clipboard';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-share-data',
  standalone: true,
  templateUrl: './share-data.component.html',
  styleUrls: ['./share-data.component.scss'],
  imports: [IonIcon,  IonHeader, IonToolbar, IonTitle, IonContent, IonButton ]
})
export class ShareDataComponent  implements OnInit {
@Input({required: true}) title!: string;
@Input({required: true}) text!: string;
@Input({required: true}) dialogTitle!: string;

  constructor() { }

  ngOnInit() {}

  async writeToClipboard() {
    await Clipboard.write({
      string: this.text
    }).then(() => Toast.show({ text: "Se ha copiado en el portapapeles", duration: 'short' }));
  };
  
}
