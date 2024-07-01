import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [HeaderComponent]
})
export class ProfilePage  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
