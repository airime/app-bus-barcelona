import { Component, Input, OnInit, booleanAttribute, numberAttribute } from '@angular/core';
import { IonBadge, IonIcon } from '@ionic/angular/standalone';
//import { addIcons } from 'ionicons';

@Component({
  selector: 'app-popover-bus-stop',
  standalone: true,
  templateUrl: './popover-bus-stop.component.html',
  styleUrls: ['./popover-bus-stop.component.scss'],
  imports: [IonIcon, IonBadge]
})
export class PopoverBusStopComponent implements OnInit {
  @Input({ required: true, transform: numberAttribute }) lat!: number;
  @Input({ required: true, transform: numberAttribute }) lng!: number;
  @Input({ required: true, transform: booleanAttribute }) intercanvi!: boolean;
  @Input({ required: true }) codiParada!: string;
  @Input({ required: true }) nomParada!: string;
  @Input({ required: true }) linies!: string;

  public readonly Tram = 'assets/Tramvia_metropolita.svg';
  public readonly BusBarcelona = 'assets/Bus_Barcelona.svg';
  public readonly MetroBarcelona = 'assets/Metro_Barcelona.svg';
  public readonly FGC = 'assets/FGC.svg';
  public readonly RodaliesBarcelona = 'assets/Rodalies_Catalunya.svg';
  public readonly BusStop = 'assets/Bus_Stop.svg';

  private _lstLiniesTram: any;
  private _lstLiniesBus: any;
  private _lstLiniesMetro: any;
  private _lstLiniesFGC: any;
  private _lstLiniesRodalies: any;

  public get lstLiniesTram() {
    return this._lstLiniesTram;
  }

  public get lstLiniesBus() {
    return this._lstLiniesBus;
  }

  public get lstLiniesMetro() {
    return this._lstLiniesMetro;
  }

  public get lstLiniesFGC() {
    return this._lstLiniesFGC;
  }

  public get lstLiniesRodalies() {
    return this._lstLiniesRodalies;
  }

  constructor() {
    //addIcons({
    //TMB: 'assets/TMB.svg', 
    //Tram: 'assets/Tramvia_metropolita.svg', 
    //BusBarcelona: 'assets/Bus_Barcelona.svg',
    //MetroBarcelona: 'assets/Metro_Barcelona.svg',
    //FGC: 'assets/FGC.svg',
    //RodaliesBarcelona: 'assets/Rodalies_Catalunya.svg',
    //BusStop: 'assets/Bus_Stop.svg'
    //});
  }

  ngOnInit() {
    var lstLinies: any[] = JSON.parse(this.linies);
    this._lstLiniesTram = lstLinies.filter(function (linia: any) { return linia.NOM_OPERADOR == "TRAM" });
    this._lstLiniesTram = this.removeDups(this._lstLiniesTram);
    this._lstLiniesBus = lstLinies.filter(function (linia: any) { return linia.NOM_OPERADOR == "TB" });
    this._lstLiniesBus = this.removeDups(this._lstLiniesBus);
    this._lstLiniesMetro = lstLinies.filter(function (linia: any) { return linia.NOM_OPERADOR == "Metro" });
    this._lstLiniesMetro = this.removeDups(this._lstLiniesMetro);
    this._lstLiniesFGC = lstLinies.filter(function (linia: any) { return linia.NOM_OPERADOR == "FGC" });
    this._lstLiniesFGC = this.removeDups(this._lstLiniesFGC);
    this._lstLiniesRodalies = lstLinies.filter(function (linia: any) { return linia.NOM_OPERADOR == "Rodalies" });
    this._lstLiniesRodalies = this.removeDups(this._lstLiniesRodalies);
  }

  private removeDups = (arr: any[]): any[] => {
    let unique: any[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (unique.findIndex((x) => x.CODI_LINIA == arr[i].CODI_LINIA) === -1) {
        unique.push(arr[i]);
      }
    }
    return unique;
  }

}
