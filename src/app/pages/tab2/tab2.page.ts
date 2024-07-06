import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [ MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent ]
})
export class Tab2Page {

  constructor() {}

  readonly title = "Buscador de línies";
  readonly userValidated = "true";

}
