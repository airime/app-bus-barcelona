import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.page.html',
  styleUrls: ['./pagenotfound.page.scss'],
  standalone: true,
  imports: [IonText, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PagenotfoundPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
