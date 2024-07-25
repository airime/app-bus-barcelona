import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';

import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem,
         IonInput, IonInputPasswordToggle, IonButton, IonLabel, IonButtons } from "@ionic/angular/standalone";

import { MenuComponent } from '../../../shared/components/menu/menu.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { userProfile } from '../../../shared/model/userProfile';
import { isNullOrEmpty } from 'src/app/shared/util/util';
import { PasswordValidator } from 'src/app/shared/util/custom.validator';
import { regExps } from '../../../shared/util/custom.validator';
import { GUIerrorType, toErrorWithMessage } from 'src/app/shared/util/errors';
import { MyCustomAnimation } from 'src/app/shared/services/myCustom.animation';


@Component({
  selector: 'app-change-email',
  standalone: true,
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss'],
  imports: [
    ReactiveFormsModule, MenuComponent, HeaderComponent,
    IonButtons, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonInput, IonInputPasswordToggle, IonButton
  ]
})
export class ChangeEmailPage  implements OnInit {
  readonly title = "Cambiar el email";
  credentials!: FormGroup;
  wait: boolean;
  private currentUser!: userProfile | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private myCustomAnimation: MyCustomAnimation,
    private alertController: AlertController
  ) { 
    this.currentUser = this.authService.currentUser;
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
    this.wait = false;
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
  get oldEmail() {
    const emailGroup = this.credentials.controls["emailGroup"];
    return emailGroup.get('oldEmail');
  }

  // Easy access for form fields
  get newEmail() {
    const emailGroup = this.credentials.controls["emailGroup"];
    return emailGroup.get('newEmail');
  }

  get password() {
    return this.credentials.get('password');
  }

  get emailGroupOk() {
    const emailGroup = this.credentials.controls["emailGroup"];
    return isNullOrEmpty(this.oldEmail?.value) || !emailGroup?.hasError('distinctValues');
  }

  ngOnInit() {
    const emailGroup = this.fb.group({
        oldEmail: new FormControl('', [Validators.required, Validators.email]),
        newEmail: new FormControl('', [Validators.required, Validators.email])
      }, { validators: PasswordValidator.distinctValues })
    this.credentials = this.fb.group({ 
        emailGroup: emailGroup,
        password: new FormControl('', [Validators.required,
          Validators.minLength(8), Validators.maxLength(24),
          Validators.pattern(this.pattern)]) });
  }

  async goBack() {
    this.navCtrl.back({ animated: true, animation: this.myCustomAnimation.customAnimation, animationDirection: "back" });
  }

  async changeEmail() {
    const message = `Se ha enviado un email con un enlace que permite restablecer la contraseña.\n` 
      + `Recuerde que debe incorporar al menos una mayúscula, una minúsculas, un dígito y un símbolo o espacio.`;
    const formErrorMessage = "Error inesperado: Puede que no se cumplan las condiciones del formulario, o ha habido un error en el servicio.";
    console.log("change email", this.credentials.valid);
    this.wait = true;
    if (this.credentials.valid
      && (!!this.currentUser && this.currentUser.email == this.oldEmail!.value)) {
      console.log("call to updateEmail");
      this.authService.updateEmail(this.newEmail!.value, this.password!.value)
       .then(
          () => {
            console.log("emailUpdated");
            this.presentAlert(message, true);
          }
        ).catch(
          (err: any) => {
            console.log("updateEmail error", err);
            this.presentAlert(err.message, false);
          }
        ).finally(
          () => this.wait = false
        );
    } else {
      this.wait = false;
      console.log(formErrorMessage);
      this.presentAlert(formErrorMessage, false);
    }
  }

  private get pattern() {
    return regExps['password'];
  }

  private async presentAlert(message: string, withLogout: boolean) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [
        {
          text: 'Entendido',
          role: 'cancel',
          handler: () => {
            console.log('Alert Cancel clicked');
          }
        }
      ],
    });
    const logoutError = "Ha fallado la operación. Si todavía se encuentra como usuario activo, por favor, use 'logout' para abandornar la aplicación.";
    alert.onDidDismiss().then((val) => {
      console.log('Alert dismissed', val);
      const { role } = val;
      this.wait = false;
      try {
        if (role == "cancel") {
          if (withLogout) {
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
        }
      } catch (err) {
        throw toErrorWithMessage(err);
      }
    });  
    await alert.present();
  }

}
