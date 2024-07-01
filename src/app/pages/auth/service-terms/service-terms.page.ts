import { Component } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-service-terms',
  standalone: true,
  templateUrl: './service-terms.page.html',
  styleUrl: './service-terms.page.scss',
  imports: [IonContent]
})
export class ServiceTermsPage {

  title = "Condicions del servei"
}
