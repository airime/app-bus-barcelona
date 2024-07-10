import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonItem, IonSelect, IonLabel, IonSelectOption, SelectCustomEvent, IonText } from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';

import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ContentHeaderComponent } from 'src/app/shared/components/content-header/content-header.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { userProfile } from 'src/app/shared/model/userProfile';
import { TmbService } from 'src/app/shared/services/tmb.service';
import { isNullOrEmpty } from 'src/app/shared/util/util';

@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  imports: [IonText, MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent, ReactiveFormsModule, IonItem, IonSelect, IonLabel, IonSelectOption, NgFor]
})
export class Tab3Page implements OnInit {

  title = "Línies";
  private currentUser!: userProfile | null;
  linies: any = [];
  lineSelected: any;

  constructor(private authService: AuthService,
    private tmbService: TmbService) {
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
  }

  ngOnInit() {
    this.ompleLinies()
  }

  private ompleLinies() {
    this.tmbService.getLines().subscribe((lines: any) => {
      lines.features.sort(function (line1: any, line2: any) {
          if (line1.properties.NOM_LINIA.charAt(0) == 'M') {
            if (line2.properties.NOM_LINIA.charAt(0) == 'M') {
              return line1.properties.NOM_LINIA > line2.properties.NOM_LINIA ? 1 : -1
            } else {
               return -1;
            }
          } else if (line2.properties.NOM_LINIA.charAt(0) == 'M') {
            return 1;
          } else if (line1.properties.CODI_LINIA >= 200 && line2.properties.CODI_LINIA >= 200) {
            if (line1.properties.NOM_LINIA.charAt(0) == line2.properties.NOM_LINIA.charAt(0)) {
              return Number.parseInt(line1.properties.NOM_LINIA.substring(1)) > Number.parseInt(line2.properties.NOM_LINIA.substring(1)) ? 1 : -1;
            } else {
              return (line1.properties.NOM_LINIA as string).charAt(0) > (line2.properties.NOM_LINIA as string).charAt(0) ? 1 : -1;
            }
          } else {
            return line1.properties.CODI_LINIA > line2.properties.CODI_LINIA ? 1 : -1;
          }
        });
      var result: any = [];
      lines.features.forEach(function (line: any) {
        result.push([line.properties.NOM_LINIA + ' - ' + line.properties.DESC_LINIA, line.properties.CODI_LINIA]);
      });
      this.linies = result;
    });
  }

  // Fills a select with the lines. Reacts to a line selection querying its stops.

    /*
      select.onchange = function (event) {
        var selected_line = lines.filter(function (line) {
          return line.CODI_LINIA == event.target.value;
        })[0];
        [].forEach.call(document.getElementsByClassName("origen"), function (el) {
          el.innerHTML = selected_line.ORIGEN_LINIA;
        });
        [].forEach.call(document.getElementsByClassName("desti"), function (el) {
          el.innerHTML = selected_line.DESTI_LINIA;
        });
    
        params = {
          app_key: write_your_app_key_here,
          app_id: write_your_app_id_here,
          // Undocumented API feature, use "propertyName" to select properties to be returned (& discard geometry)
          propertyName: "SENTIT,ORDRE,NOM_PARADA"
        };
        var url = "https://api.tmb.cat/v1/transit/linies/bus/" + event.target.value + "/parades/";
        ajax(url, params, draw_line_stops);
      }
        */


  /*
data => {
  this.hideProgressBar();

  console.log(data['_body']);
  var response = JSON.parse(data['_body']);
  this.allplans = response.data;
  console.log("all plans" + this.allplans);
  for (var i = 0; i < this.allplans.length; i++) {
      this.planobject = { $value: i + 1, fullName: this.allplans[i] };
      this.myFriendsArray.push(this.planobject);
  }
  console.log(this.myFriendsArray);

}, error => {
  this.hideProgressBar();
  console.log(error);
  this.showAlertMessage('Server Error please try');
}
      */

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }


  get isSelectLine() {
    return !!this.lineSelected;
  }


  onSelectChange(e$: SelectCustomEvent<any>) {
    this.lineSelected = e$.detail.value;
  }


}
