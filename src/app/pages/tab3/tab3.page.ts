import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonTabs, IonContent, IonItem, IonSelect, IonLabel, IonSelectOption, SelectCustomEvent, IonText, IonRow, IonGrid, IonCol, PopoverController, IonList } from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';

import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { ContentHeaderComponent } from 'src/app/shared/components/content-header/content-header.component';
import { PopoverBusStopComponent } from 'src/app/shared/components/popover-bus-stop/popover-bus-stop.component'
import { TmbGenpropertiesService } from 'src/app/shared/services/tmb-genproperties.service';
import { MessageHubService } from 'src/app/shared/services/messageHub.service';
import { NomFamiliaBusValues, IStopInfo, NomFamiliaBus } from 'src/app/shared/model/internalInterfaces';
import { TupleCoordinates, TupleLinia } from 'src/app/shared/model/internalTuples';
import { IPositionMessage } from 'src/app/shared/interfaces/IMessage';


@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  imports: [IonList, IonCol, IonGrid, IonRow, IonText, MenuComponent, HeaderComponent, ContentHeaderComponent,
    IonContent, ReactiveFormsModule, IonItem, IonSelect, IonLabel, IonSelectOption, NgFor]
})
export class Tab3Page implements OnInit {
  @Input() selectedLineKey?: string; //la selecció del select

  readonly title = "Línies";

  public selectedServices: string[] = [];
  public selectedFamiliesText?: string;
  
  public linies: TupleLinia[] = []; //les línies disponibles que omplen el select
  public selectedLineText?: string;

  get thereIsSelectedLine() {
    return !!this.selectedLineKey;
  }

  public NomFamiliaBusValues = NomFamiliaBusValues;
  
  public get filteredLines() {
    if (!this.selectedServices || this.selectedServices.length == 0) {
      return this.linies;
    } else {
      return this.linies.filter(line => this.selectedServices.includes(<NomFamiliaBus>line[4]));
    }
  }

  public anada!: IStopInfo[]; // llista de parades d'anada per la línia seleccionada
  public tornada!: IStopInfo[]; // llista de parades de tornada per a la línia seleccionada

  constructor(private router: Router,
              private parentTabs: IonTabs,
              private tmbGenpropertiesService: TmbGenpropertiesService,
              private messageService: MessageHubService,
              public popoverController: PopoverController) {
  }

  ngOnInit() {
    if (!this.selectedLineKey) {
      console.log("No line key (select needed):");
      // omplir el select per seleccionar línia
      this.ompleLinies();
    } else {
      console.log("Line key:", this.selectedLineKey);
      // només carreguem la línia que ens demanen
      this.ompleUnaLinia(Number.parseInt(this.selectedLineKey));
      // Remove query params
      this.router.navigate([], {
        queryParams: {
          'selectedLineKey': null,
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  selectClick() {
    if (this.linies.length <= 1) {
      this.ompleLinies();
    }
  }

  onSelectFamiliesChange(e$: SelectCustomEvent<any>) {
    this.selectedServices = e$.detail.value;
    if (!this.selectedServices || this.selectedServices.length == 0) {
      this.selectedFamiliesText = "TOTS";
    } else {
      this.selectedFamiliesText = this.selectedServices.join(", "); //.slice(0, -2);
    }
  }

  onSelectChange(e$: SelectCustomEvent<any>) {
    this.selectLine(Number.parseInt(e$.detail.value));
  }

  /* En comptes de fer servir un rang de CODI_LINIA s'hauria de diferenciar per família */
  private async ompleLinies() {
    this.linies = await this.tmbGenpropertiesService.getRouteNumbers();
  }

  private async ompleUnaLinia(codiLinia: number) {
    this.linies = await this.tmbGenpropertiesService.getOneRouteNumber(codiLinia);
    this.selectLine(codiLinia);
    this.selectedLineText = this.linies[0][0];
  }

  // acció de selecció del formulari
  private async selectLine(codiLinia: number) {
    this.selectedLineKey = codiLinia.toString();
    let selected_line = this.linies.filter(function (line: any) {
      return line[1] /* CODI_LINIA */ == codiLinia;
    })[0];
    this.selectedLineText = selected_line[0];
    [].forEach.call(document.getElementsByClassName("origen"), function (el: HTMLElement) {
      el.innerHTML = selected_line[2] /* ORIGEN_LINIA */;
    });
    [].forEach.call(document.getElementsByClassName("desti"), function (el: HTMLElement) {
      el.innerHTML = selected_line[3] /* DESTI_LINIA */;
    });
    let { outwardBusStops, returnBusStops } = await this.tmbGenpropertiesService.getBusRouteStops(Number.parseInt(this.selectedLineKey));
    this.anada = outwardBusStops;
    this.tornada = returnBusStops;
  }

  public showPosition = (lat: number, lng: number) => {
    console.log(this.parentTabs, this.parentTabs.getSelected());
    const message = {
          tag: "position",
          content: { lat, lng }
      } as IPositionMessage;
    console.log(message.content);
    this.messageService.sendMessage(message);
    this.parentTabs.select("tab1");
    //this.app.getRootNav().getActiveChildNav().select(1);
}

  async clickParada(e: Event, codiParada: number, nomParada: string, coordParada: TupleCoordinates) {
    if (!!this.selectedLineKey) {
      let info = await this.tmbGenpropertiesService.getBusRouteStopConn(Number.parseInt(this.selectedLineKey), codiParada);
      const popover = await this.popoverController.create({
        component: PopoverBusStopComponent,
        componentProps: {
          lat: coordParada[1],
          lng: coordParada[0],
          intercanvi: false,
          codiParada: codiParada,
          nomParada: nomParada,
          liniesTram: info.liniesTram,
          liniesBus: info.liniesBus,
          liniesMetro: info.liniesMetro,
          liniesFGC: info.liniesFGC,
          liniesRodalies: info.liniesRodalies,
          ref: this
        },
        event: e,
      });
      await popover.present();
    } else {
      throw new Error("clickParada without a selectedLineKey");
    }
  }

  async clickIntercanvi(e: Event, codiIntercanvi: number, nomParada: string, coordParada: TupleCoordinates) {
    let info = await this.tmbGenpropertiesService.getBusInterconnConn(codiIntercanvi);
    const popover = await this.popoverController.create({
      component: PopoverBusStopComponent,
      componentProps: {
        lat: coordParada[1],
        lng: coordParada[0],
        intercanvi: true,
        codiParada: codiIntercanvi,
        nomParada: nomParada,
        liniesTram: info.liniesTram,
        liniesBus: info.liniesBus,
        liniesMetro: info.liniesMetro,
        liniesFGC: info.liniesFGC,
        liniesRodalies: info.liniesRodalies,
        ref: this
      },
      event: e,
    });
    await popover.present();
  }

}
