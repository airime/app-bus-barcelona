import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { timer } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';

import { HeaderComponent } from '../../../shared/components/header/header.component';

/*
import { MatCard, MatCardContent, MatCardActions, MatCardHeader } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
*/

import { userProfile } from '../../../shared/model/userProfile';
import { GUIerrorType, getErrorMessage } from '../../../shared/util/errors';


@Component({
  selector: 'app-recovery',
  standalone: true,
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
  imports: [ReactiveFormsModule, HeaderComponent, 
    /* FooterComponent, MatFormFieldModule,
    MatCard, MatCardHeader, MatCardContent, MatCardActions, MatInputModule, MatIconModule, MatButtonModule, RouterLink */
    ],
})
export class RecoveryPage  implements OnInit {
  hidePassword: boolean;
  credentials!: FormGroup;
  currentUser!: userProfile | null;
  emailSent: boolean;
  wait: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.hidePassword = true;
    this.emailSent = false;
    this.wait = false;
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }


  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
  }

  obrirCondicions() {
    // Converts the route into a string that can be used 
    // with the window.open() function
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`service-terms`])
    );
    window.open(url, '_blank');
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Hello World!',
      duration: 1500,
      position: position,
    });
  }

  async passwordRecovery() {
    this.wait = true;
    if (this.credentials.valid
      && (!this.currentUser || this.currentUser!.email == this.email!.value)) {
      this.authService.sendPasswordResetEmail(this.email!.value)
        .then(
          () => {
            const toast = this.toastController.open(hintMessages["passwordRecoveryDone"], formActions['entente']);
            toast.afterDismissed().subscribe(info => {
              if (info.dismissedByAction) {
                this.wait = false;
                if (!!this.currentUser) {
                  this.authService.logout()
                  .then(() => this.router.navigate(['login']))
                  .catch(() => {
                    this.wait = false;
                    const err = new Error(this.errors["serveiLogout"]);
                    err.name = GUIerrorType.AuthenticationError;
                    throw err;
                  });
                } else {
                    this.router.navigate(['login']);
                }
              }
            });
          }
        ).catch(
          (err: any) => {
            this.wait = false;
            const error = new Error(getErrorMessage(err));
            error.name = GUIerrorType.AuthenticationError;
            throw error;
          }
        );
    } else {
      this.wait = false;
      const err = new Error(this.errors["formulari"]);
      err.name = GUIerrorType.FormError;
      throw err;
    }
  }

}
