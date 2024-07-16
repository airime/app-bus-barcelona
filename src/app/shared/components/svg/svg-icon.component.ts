import { Component, ElementRef, Input, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  template: "",
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent implements OnInit {
  //@HostBinding('style.-webkit-mask-image')
  private _src!: string;

  constructor(private el: ElementRef,
              private http: HttpClient) {
  }

  @Input()
  public set src(filePath: string) {
    this._src = filePath; //`url("${filePath}")`;
  }

  ngOnInit(): void {
    this.http.get(this._src, {responseType: 'text'}).subscribe(svg => {
      this.el.nativeElement.innerHTML = svg;
    });
  }

}