import { Component, OnInit } from '@angular/core';
import { IonContent, IonList, IonItem, IonIcon, IonLabel, IonNote, IonBadge } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ContentHeaderComponent } from '../../shared/components/content-header/content-header.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { userProfile } from 'src/app/shared/model/userProfile';
import { isNullOrEmpty } from 'src/app/shared/util/util';
import { TmbService } from 'src/app/shared/services/tmb.service';
import { ActivatedRoute } from '@angular/router';
import { IiBusRouteStop, IiBusStop } from 'src/app/shared/model/ibusStop';


@Component({
  selector: 'app-stopid',
  standalone: true,
  templateUrl: 'stopid.page.html',
  styleUrls: ['stopid.page.scss'],
  imports: [MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent, IonList, IonItem, IonIcon, IonLabel, IonNote, IonBadge]
})
export class StopidPage implements OnInit {
  readonly title = "Informació de parada";

  public currentStop: number = -1;
  public currentLine: number = -1;
  public nomLinia!: string;
  public colorLinia!: string;
  public buses: (IiBusStop[] | IiBusRouteStop[]) = [];

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
    this.currentStop = Number(this.route.snapshot.params['id']);
    const linia = this.route.snapshot.params['line'];
    this.currentLine = linia ? Number(linia) : -1;
    if (this.currentLine >= 0) {
      this.route.queryParams.subscribe(params => {
          this.nomLinia = params['nomLinia']?? "";
          this.colorLinia = params['colorLinia']?? "000000";
          console.log(this.nomLinia, this.colorLinia);
        }
      );
    }
    console.log(this.currentLine, this.nomLinia, this.colorLinia)
    this.getStop();
  }

  public get cssBadgeLinia(): string {
    return !!this.currentLine ? `--color:white;--background:#${this.colorLinia}` : "--color:white;";
  }

  public isIiBusStop(linia: IiBusStop | IiBusRouteStop): linia is IiBusStop {
    return 'line' in linia;
  }

  getStop(): void {
    if (this.currentLine > 0) {
      this.tmbApiService.getiBusStopLine(this.currentStop, this.currentLine)
        .subscribe(response => {
          if (response.status === 'success') this.buses = response.data.ibus;
          else throw ('L\'obtenció de dades ha fallat, torna-ho a intentar');
        });
    } else {
      this.tmbApiService.getiBusStop(this.currentStop)
        .subscribe(response => {
          if (response.status === 'success') this.buses = response.data.ibus;
          else throw ('L\'obtenció de dades ha fallat, torna-ho a intentar');
        });
    }
  }

  goBack(): void {
    this.location.back();
  }

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }

}
