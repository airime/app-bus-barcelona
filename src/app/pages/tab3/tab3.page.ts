import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonItem, IonSelect, IonLabel, IonSelectOption, SelectCustomEvent, IonText, IonRow, IonGrid, IonCol } from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';

import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ContentHeaderComponent } from 'src/app/shared/components/content-header/content-header.component';
import { userProfile } from 'src/app/shared/model/userProfile';
import { TmbService } from 'src/app/shared/services/tmb.service';
import { isNullOrEmpty } from 'src/app/shared/util/util';

@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  imports: [IonCol, IonGrid, IonRow, IonText, MenuComponent, HeaderComponent, ContentHeaderComponent, IonContent, ReactiveFormsModule, IonItem, IonSelect, IonLabel, IonSelectOption, NgFor]
})
export class Tab3Page implements OnInit {

  readonly title = "Línies";
  linies: any = []; //les línies disponibles que omplen el select
  selectedLineKey: any; //la selecció del select
  anada: any; // llista de parades d'anada per la línia seleccionada
  tornada: any; // llista de parades de tornada per a la línia seleccionada

  constructor(private tmbService: TmbService) {
  }

  ngOnInit() {
    // omplir el select per seleccionar línia
    this.ompleLinies();
  }

  get isSelectLine() {
    return !!this.selectedLineKey;
  }

  onSelectChange(e$: SelectCustomEvent<any>) {
    this.selectedLineKey = e$.detail.value;
    var selected_line = this.linies.filter(function (line: any) {
      return line[1] /* CODI_LINIA */ == e$.detail.value;
    })[0];
    [].forEach.call(document.getElementsByClassName("origen"), function (el: HTMLElement) {
      el.innerHTML = selected_line[2] /* ORIGEN_LINIA */;
    });
    [].forEach.call(document.getElementsByClassName("desti"), function (el: HTMLElement) {
      el.innerHTML = selected_line[3] /* DESTI_LINIA */;
    });
    this.tmbService.getLineStops(this.selectedLineKey).subscribe((result: any) => {
      var stops = this.properties(result)

      // anada
      this.anada = stops.filter(function (stop: any) {    // Filter by direction
        return stop.SENTIT == "A";
      }).sort(function (stop1: any, stop2: any) { // Order
        return stop1.ORDRE - stop2.ORDRE;
      })

      // tornada: Same for the opposite direction
      this.tornada = stops.filter(function (stop: any) {    // Filter by direction
        return stop.SENTIT == "T";
      }).sort(function (stop1: any, stop2: any) { // Order
        return stop1.ORDRE - stop2.ORDRE;
      })
    
    });
  }

  // Converts a GeoJSON FeatureCollection structure into a "flat" array of object properties.
  // Geometries are discarded.
  private properties(featureCollection: any) {
    var properties: any = [];
    featureCollection.features.forEach(function (feature: any) {
      properties.push(feature.properties);
    });
    return properties;
  }  

  private ompleLinies() {
    this.tmbService.getLines().subscribe((result: any) => {
      var lines = this.properties(result);
      lines.sort(function (line1: any, line2: any) {
          if (line1.NOM_LINIA.charAt(0) == 'M') {
            if (line2.NOM_LINIA.charAt(0) == 'M') {
              return line1.NOM_LINIA > line2.NOM_LINIA ? 1 : -1
            } else {
               return -1;
            }
          } else if (line2.NOM_LINIA.charAt(0) == 'M') {
            return 1;
          } else if (line1.CODI_LINIA >= 200 && line2.CODI_LINIA >= 200) {
            if (line1.NOM_LINIA.charAt(0) == line2.NOM_LINIA.charAt(0)) {
              return Number.parseInt(line1.NOM_LINIA.substring(1)) > Number.parseInt(line2.NOM_LINIA.substring(1)) ? 1 : -1;
            } else {
              return (line1.NOM_LINIA as string).charAt(0) > (line2.NOM_LINIA as string).charAt(0) ? 1 : -1;
            }
          } else {
            return line1.CODI_LINIA > line2.CODI_LINIA ? 1 : -1;
          }
        });
      var result: any = [];
      lines.forEach(function (line: any) {
        result.push([line.NOM_LINIA + ' - ' + line.DESC_LINIA,
                     line.CODI_LINIA,
                     line.ORIGEN_LINIA,
                     line.DESTI_LINIA]);
      });
      this.linies = result;
    });
  }


}
