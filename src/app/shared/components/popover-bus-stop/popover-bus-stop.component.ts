import { Component, Input, booleanAttribute, numberAttribute } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { IonBadge, IonIcon, IonText } from '@ionic/angular/standalone';
import { IBusStopConn } from '../../model/internalInterfaces';
import { toIBusStopConnArray } from '../../model/transforms';
import { Tab3Page } from 'src/app/pages/tab3/tab3.page';
//import { addIcons } from 'ionicons';

@Component({
  selector: 'app-popover-bus-stop',
  standalone: true,
  templateUrl: './popover-bus-stop.component.html',
  styleUrls: ['./popover-bus-stop.component.scss'],
  imports: [IonText, IonIcon, IonBadge]
})
export class PopoverBusStopComponent {
  @Input({ required: true, transform: numberAttribute }) lat!: number;
  @Input({ required: true, transform: numberAttribute }) lng!: number;
  @Input({ required: true, transform: booleanAttribute }) intercanvi!: boolean;
  @Input({ required: true }) codiParada!: string;
  @Input({ required: true }) nomParada!: string;
  @Input({ required: true, transform: toIBusStopConnArray }) set liniesTram(value: IBusStopConn[]) { this._liniesTram = value; };
  @Input({ required: true, transform: toIBusStopConnArray }) set liniesBus(value: IBusStopConn[]) { this._liniesBus = value; };
  @Input({ required: true, transform: toIBusStopConnArray }) set liniesMetro(value: IBusStopConn[]) { this._liniesMetro = value; };
  @Input({ required: true, transform: toIBusStopConnArray }) set liniesFGC(value: IBusStopConn[]) { this._liniesFGC = value; };
  @Input({ required: true, transform: toIBusStopConnArray }) set liniesRodalies(value: IBusStopConn[]) { this._liniesRodalies = value; };
  
  public readonly Tram = 'assets/Tramvia_metropolita.svg';
  public readonly BusBarcelona = 'assets/Bus_Barcelona.svg';
  public readonly MetroBarcelona = 'assets/Metro_Barcelona.svg';
  public readonly FGC = 'assets/FGC.svg';
  public readonly RodaliesBarcelona = 'assets/Rodalies_Catalunya.svg';
  public readonly BusStop = 'assets/Bus_Stop.svg';

  public get liniesTram() { 
    return this._liniesTram;
  }
  public get liniesBus() {
    return this._liniesBus;
  }
  public get liniesMetro() { 
    return this._liniesMetro;
  }
  public get liniesFGC() {
    return this._liniesFGC;
  }
  public get liniesRodalies() {
    return this._liniesRodalies;
  }

  private _liniesTram!: IBusStopConn[];
  private _liniesBus!: IBusStopConn[];
  private _liniesMetro!: IBusStopConn[];
  private _liniesFGC!: IBusStopConn[];
  private _liniesRodalies!: IBusStopConn[];
  private parentPage!: Tab3Page;

  constructor(private params: NavParams) {
    //addIcons({
    //TMB: 'assets/TMB.svg', 
    //Tram: 'assets/Tramvia_metropolita.svg', 
    //BusBarcelona: 'assets/Bus_Barcelona.svg',
    //MetroBarcelona: 'assets/Metro_Barcelona.svg',
    //FGC: 'assets/FGC.svg',
    //RodaliesBarcelona: 'assets/Rodalies_Catalunya.svg',
    //BusStop: 'assets/Bus_Stop.svg'
    //});
    this.parentPage = this.params.get('ref');
  }

  showConfirm() {
    this.parentPage.showPosition(this.lat, this.lng);
  }

}
