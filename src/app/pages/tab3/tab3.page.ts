import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonItem, IonSelect, IonLabel, IonSelectOption, SelectCustomEvent, IonText, IonRow, IonGrid, IonCol, PopoverController } from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';

import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ContentHeaderComponent } from 'src/app/shared/components/content-header/content-header.component';
import { PopoverBusStopComponent } from 'src/app/shared/components/popover-bus-stop/popover-bus-stop.component'
import { TmbService } from 'src/app/shared/services/tmb.service';
import { TupleCoordinates, TupleLinia } from 'src/app/shared/model/internalTuples';


@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  imports: [IonCol, IonGrid, IonRow, IonText, MenuComponent, HeaderComponent, ContentHeaderComponent,
    IonContent, ReactiveFormsModule, IonItem, IonSelect, IonLabel, IonSelectOption, NgFor]
})
export class Tab3Page implements OnInit {
  @Input() selectedLineKey?: string; //la selecció del select

  readonly title = "Línies";
  selectedLineText?: string;
  linies: TupleLinia[] = []; //les línies disponibles que omplen el select
  anada: any; // llista de parades d'anada per la línia seleccionada
  tornada: any; // llista de parades de tornada per a la línia seleccionada

  constructor(private router: Router,
    private tmbService: TmbService,
    public popoverController: PopoverController) {
  }

  ngOnInit() {
    if (!this.selectedLineKey) {
      console.log("No line key:", this.selectedLineKey);
      // omplir el select per seleccionar línia
      this.ompleLinies();
    } else {
      console.log("Line key:", this.selectedLineKey);
      // només carreguem la línia que ens demanen
      this.ompleUnaLinia(this.selectedLineKey);
      // Remove query params
      this.router.navigate([], {
        queryParams: {
          'yourParamName': null,
          'youCanRemoveMultiple': null,
        },
        queryParamsHandling: 'merge'
      });
    }
  }


  get isSelectLine() {
    return !!this.selectedLineKey;
  }

  onSelectChange(e$: SelectCustomEvent<any>) {
    this.selectLine(e$.detail.value as string);
  }

  // acció de selecció del formulari
  private async selectLine(codiLinia: string) {
    this.selectedLineKey = codiLinia;
    var selected_line = this.linies.filter(function (line: any) {
      return line[1] /* CODI_LINIA */ == codiLinia;
    })[0];
    [].forEach.call(document.getElementsByClassName("origen"), function (el: HTMLElement) {
      el.innerHTML = selected_line[2] /* ORIGEN_LINIA */;
    });
    [].forEach.call(document.getElementsByClassName("desti"), function (el: HTMLElement) {
      el.innerHTML = selected_line[3] /* DESTI_LINIA */;
    });
    this.tmbService.getLineStops(this.selectedLineKey).subscribe((result: any) => {
      var stops = this.tmbService.properties(result);

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

  selectClick() {
    if (this.linies.length <= 1) {
      this.ompleLinies();
    }
  }

  async clickParada(e: Event, codiParada: string, nomParada: string, coordParada: TupleCoordinates) {
    if (!!this.selectedLineKey) {
      var info: any;
      this.tmbService.getLineStopInfo(this.selectedLineKey, codiParada).subscribe(async (result: any) => {
        info = this.tmbService.properties(result);
        const popover = await this.popoverController.create({
          component: PopoverBusStopComponent,
          componentProps: {
            lat: coordParada[0],
            lng: coordParada[1],
            intercanvi: false,
            codiParada: codiParada,
            nomParada: nomParada,
            linies: JSON.stringify(info)
          },
          event: e,
        });
        await popover.present();
        //const { role } = await popover.onDidDismiss();
        //console.log(`Popover dismissed with role: ${role}`);
      });
    } else {
      throw new Error("clickParada without a selectedLineKey");
    }
  }

  async clickIntercanvi(e: Event, codiIntercanvi: string, nomParada: string, coordParada: TupleCoordinates) {
    var info: any;
    this.tmbService.getIntercanviInfo(codiIntercanvi).subscribe(async (result: any) => {
      info = this.tmbService.properties(result);
      const popover = await this.popoverController.create({
        component: PopoverBusStopComponent,
        componentProps: {
          lat: coordParada[0],
          lng: coordParada[1],
          intercanvi: true,
          codiParada: codiIntercanvi,
          nomParada: nomParada,
          linies: JSON.stringify(info)
        },
        event: e,
      });
      await popover.present();
      //const { role } = await popover.onDidDismiss();
      //console.log(`Popover dismissed with role: ${role}`);
    });
  }

  private async ompleLinies() {
    this.tmbService.getLines().subscribe((value: any) => {
      let lines = this.tmbService.properties(value);
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
      const result: TupleLinia[] = [];
      lines.forEach(function (line: any) {
        result.push([line.NOM_LINIA + ' - ' + line.DESC_LINIA,
        line.CODI_LINIA,
        line.ORIGEN_LINIA,
        line.DESTI_LINIA]);
      });
      this.linies = result;
    });
  }

  private async ompleUnaLinia(codiLinia: string) {
    this.tmbService.getLineDescription(codiLinia).subscribe((result: any) => {
      var linia = this.tmbService.properties(result)[0];
      this.linies = [];
      this.linies.push([linia.NOM_LINIA + ' - ' + linia.DESC_LINIA,
      linia.CODI_LINIA,
      linia.ORIGEN_LINIA,
      linia.DESTI_LINIA]);
      this.selectLine(codiLinia);
      this.selectedLineText = this.linies[0][0];
    });
  }


}
