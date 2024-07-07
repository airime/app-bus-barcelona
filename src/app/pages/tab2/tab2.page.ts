import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { userProfile } from 'src/app/shared/model/userProfile';
import { isNullOrEmpty } from 'src/app/shared/util/util';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [ MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent ]
})
export class Tab2Page {

  constructor(private authService: AuthService) {
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
  }

  readonly title = "Buscador de línies";
  private currentUser!: userProfile | null;

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }

}
