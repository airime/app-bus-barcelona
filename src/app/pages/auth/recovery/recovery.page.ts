import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonInput, IonButton } from "@ionic/angular/standalone";

import { MenuComponent } from '../../../shared/components/menu/menu.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { userProfile } from '../../../shared/model/userProfile';
import { GUIerrorType, getErrorMessage, toErrorWithMessage } from '../../../shared/util/errors';
import { PasswordValidator } from 'src/app/shared/util/custom.validator';
import { isNullOrEmpty } from 'src/app/shared/util/util';

@Component({
  selector: 'app-recovery',
  standalone: true,
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
  imports: [ MenuComponent, ReactiveFormsModule, HeaderComponent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonInput, IonButton
  ],
})
export class RecoveryPage implements OnInit {
  credentials!: FormGroup;
  wait: boolean;
  private currentUser!: userProfile | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
    this.wait = false;
  }

  get title() {
    return !!this.currentUser? "Cambiar la contraseña" : "Restablecer la contraseña"
  }
  
  get loggedIn() {
    return !!this.currentUser;
  }

  get userValidated() {
    return this.currentUser?.emailVerified?? false;
  }

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }

  // Easy access for form fields
  get email() {
    const emailGroup = this.credentials.controls["emailGroup"];
    return emailGroup.get('email');
  }

  get emailGroupOk() {
    if (!!this.currentUser) {
      return true;
    } else {
      const emailGroup = this.credentials.controls["emailGroup"];
      return !emailGroup?.hasError('areEqual');
    }
  }

  ngOnInit() {
    const emailGroup = !this.currentUser ?
      this.fb.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        emailAgain: new FormControl('', [Validators.required, Validators.email])
      }, { validators: PasswordValidator.areEqual })
      : this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      });
    this.credentials = this.fb.group({ emailGroup: emailGroup });
  }

  obrirCondicions() {
    // Converts the route into a string that can be used 
    // with the window.open() function
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`service-terms`])
    );
    window.open(url, '_blank');
  }

  private async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
          handler: () => {
            console.log('Toast error Cancel clicked');
          }
        }
      ],
      position: position,
    });
    const logoutError = "Ha fallado la operación. Si todavía se encuentra como usuario activo, por favor, use 'logout' para abandornar la aplicación.";
    toast.onDidDismiss().then((val) => {
      console.log('Toast dismissed', val);
      const { role } = val;
      this.wait = false;
      try {
        if (role == "cancel") {
          if (!!this.currentUser) {
            this.authService.logout()
              .then(() => this.router.navigate(['login']))
              .catch(() => {
                const err = new Error(logoutError);
                err.name = GUIerrorType.AuthenticationError;
                throw err;
              });
          } else {
            this.router.navigate(['login']);
          }
        }
      } catch (err) {
        throw toErrorWithMessage(err);
      }
    });  
    await toast.present();
  }

  async passwordRecovery() {
    const message = `Se ha enviado un email con un enlace que permite restablecer la contraseña.\n` 
      + `Recuerde que debe incorporar al menos una mayúscula, una minúsculas, un dígito y un símbolo o espacio.`;
    const formErrorMessage = "Error inesperado: Puede que no se cumplan las condiciones del formulario, o ha habido un error en el servicio.";
    this.wait = true;
    if (this.credentials.valid
      && (!this.currentUser || this.currentUser!.email == this.email!.value)) {
      this.authService.sendPasswordResetEmail(this.email!.value)
        .then(
          () => {
            this.presentToast("middle", message);
          }
        ).catch(
          (err: any) => {
            this.wait = false;
            const error = new Error(getErrorMessage(err));
            error.name = GUIerrorType.AuthenticationError;
            throw error;
          }
        ).finally(
          () => this.wait = false
        );
    } else {
      this.wait = false;
      const err = new Error(formErrorMessage);
      err.name = GUIerrorType.FormError;
      throw err;
    }
  }

}
