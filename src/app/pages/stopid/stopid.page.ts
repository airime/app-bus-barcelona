import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { userProfile } from 'src/app/shared/model/userProfile';
import { isNullOrEmpty } from 'src/app/shared/util/util';
import { TmbService } from 'src/app/shared/services/tmb.service';
import { ActivatedRoute } from '@angular/router';
import { IBus } from 'src/app/shared/model/ibusStop';


@Component({
  selector: 'app-stopid',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: 'stopid.page.html',
  styleUrls: ['stopid.page.scss'],
  imports: [ MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent ]
})
export class StopidPage implements OnInit {
  readonly title = "Mapa busos Barcelona";

  public currentStop: number = -1;
  public buses: IBus[] = [];

  private currentUser!: userProfile | null;

  constructor(
    private route: ActivatedRoute,
    private tmbApiService: TmbService,
    private location: Location,
    private authService: AuthService
  ) {
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
  }

  ngOnInit(): void {
    this.getStop();
  }

  getStop(): void {
    this.currentStop = Number(this.route.snapshot.params['id']);
    this.tmbApiService.getiBusStop(this.currentStop)
    .subscribe(response => {
      if (response.status === 'success') this.buses = response.data.ibus;
      else throw('L\'obtenció de dades ha fallat, torna-ho a intentar');
    });
  }

  goBack(): void {
    this.location.back();
  }

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }

}
