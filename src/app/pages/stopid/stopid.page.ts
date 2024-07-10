import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { userProfile } from 'src/app/shared/model/userProfile';
import { isNullOrEmpty } from 'src/app/shared/util/util';
import { TmbApiService } from 'src/app/shared/services/tmbApi.service';
import { ActivatedRoute } from '@angular/router';
import { Bus } from 'src/app/shared/model/busStop';


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

  public buses: Bus[] = [];

  private currentUser!: userProfile | null;

  constructor(
    private route: ActivatedRoute,
    private tmbApiService: TmbApiService,
    private location: Location,
    private authService: AuthService
  ) {
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
  }

  ngOnInit(): void {
    this.getStop();
  }

  getStop(): void {
    const id = Number(this.route.snapshot.params['id']);
    this.tmbApiService.getStop(id)
    .subscribe(response => this.buses = response.data.ibus);
  }

  goBack(): void {
    this.location.back();
  }

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }

}
