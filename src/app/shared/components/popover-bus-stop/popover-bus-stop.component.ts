import { Component, Input, OnInit, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-popover-bus-stop',
  templateUrl: './popover-bus-stop.component.html',
  styleUrls: ['./popover-bus-stop.component.scss'],
})
export class PopoverBusStopComponent  implements OnInit {
@Input({ required: true, transform: numberAttribute }) lat!: number;
@Input({ required: true, transform: numberAttribute }) lng!: number;

  constructor() { }

  ngOnInit() {}

}
