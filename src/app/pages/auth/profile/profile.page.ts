import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, MenuController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5';
import {
  IonRow, IonGrid, IonCol, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  IonTitle, IonButtons, IonButton, IonList, IonItem, IonInput, IonInputPasswordToggle, IonAvatar, IonIcon, IonText, IonLabel
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';

import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { userProfile } from 'src/app/shared/model/userProfile';
import { DisplayNameValidator, regExps } from 'src/app/shared/util/custom.validator';
import { GUIerrorType } from 'src/app/shared/util/errors';
import { isNullOrEmpty, plainLowerCaseString, removeSpacesAlsoNonbreakables } from 'src/app/shared/util/util';
import { MyCustomAnimation } from 'src/app/shared/services/myCustom.animation';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [IonLabel, IonText, IonIcon, MenuComponent, HeaderComponent, ReactiveFormsModule, IonTitle,
    IonGrid, IonCol, IonRow, IonList, IonItem, IonInput, IonInputPasswordToggle, IonAvatar, IonButtons, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent]
})
export class ProfilePage implements OnInit {
  private _email: string;
  private _displayName?: string | null;
  private _profileImgUrl?: string | null;
  private _profileForm: FormGroup;

  //private profileOptionsForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private myCustomAnimation: MyCustomAnimation
  ) {
    this.authService.refreshCurrentUser();
    this._email = "";
    this._profileForm = this.createForm(fb);
    // OPCIO PER A PREFERÈNCIES ADDICIONALS DE L'USUARI (pe. Idioma)
    //this.profileOptionsForm = this.createForm2(fb);
  }
  
  async refreshPage() {
    await this.authService.refreshCurrentUser().then(() => this.ngOnInit());   
  }

  ngOnInit() {
    addIcons({
      gravatar: 'assets/gravatar.svg'
    });
    const currentUser = this.authService.currentUser;
    if (currentUser && !!currentUser.email) {
      this.fillForm(currentUser);
    } else {
      /* PAGE ERROR! */
      this.router.navigateByUrl('login', { replaceUrl: true });
      const err = new Error("Ningún usuario ha iniciado la sesión.");
      err.name = GUIerrorType.FormError;
      throw err;
    }
  }

  private createForm(fb: FormBuilder): FormGroup {
    return fb.group({
      newDisplayName: ['',
        [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
        [DisplayNameValidator.createValidator(this.authService)]],
      photoURL: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(8), Validators.maxLength(24),
        Validators.pattern(this.pattern)]
      ]
    });
  }

  /* 
    //OPCIO PER A PREFERÈNCIES ADDICIONALS DE L'USUARI (pe. Idioma)
    private createForm2(fb: FormBuilder) : FormGroup {
      return fb.group({
        firstProfile: [''],
        secondProfile: [''],
        thirdProfile: [''],
      });
    }
   */

  private fillForm(usr: userProfile) {
    /* dades que depenen de usr */
    const userVerified = usr.emailVerified;
    this._email = usr.email! + (userVerified ? "" : " ?");
    console.log(userVerified ? "User verified" : "User email pending verification");
    this._displayName = usr.displayName ?? undefined;
    this._profileImgUrl = usr.photoURL ?? null;
    /* primer form */
    this._profileForm.controls["newDisplayName"].setValue(usr.displayName);
    this._profileForm.controls["photoURL"].setValue(usr.photoURL);
  }

  private get pattern() { return regExps['password']; }

  get title() { return "Perfil del usuario"; }
  get previewTitle() { return "Previsualización"; }
  get showDisplayName() { return "Nombre público para mostrar" }
  get profileForm() { return this._profileForm; }
  get email() { return this._email; }
  get displayName() { return this._displayName; }
  get profileImgUrl() { return this._profileImgUrl; }

  get userValidated(): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser?.emailVerified ?? false;
  }

  get displayNameDefined() {
    const currentUser = this.authService.currentUser;
    return !isNullOrEmpty(currentUser?.displayName);
  }

  get userValidatedWithDisplayname(): boolean {
    const currentUser = this.authService.currentUser;
    if (!!currentUser) {
      return currentUser.emailVerified && !!(currentUser.displayName);
    } else return false;
  }

  get readyToSubmit(): boolean {
    const currentUser = this.authService.currentUser;
    if (!!currentUser) {
      const value = (currentUser.emailVerified ?? false) &&
        this._profileForm.controls["newDisplayName"].valid &&
        this._profileForm.controls['photoURL'].valid &&
        (this._profileForm.controls['newDisplayName'].value != currentUser.displayName
          || this._profileForm.controls['photoURL'].value != currentUser.photoURL);
      return value;
    }
    else return false;
  }

  resendVerification() {
    this.menuCtrl.close();
    this.navCtrl.navigateRoot('/resend-verification',
                               { animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  changePassword() {
    this.menuCtrl.close();
    this.navCtrl.navigateRoot('/change-password',
                                 { animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  nomInputEvent($event: any) {
    const newValue = isNullOrEmpty($event.target.value as string | null | undefined) ?
      null : $event.target.value as string;
    const newValueTransformed = newValue === null ? null : plainLowerCaseString(newValue);
    this._displayName = isNullOrEmpty(newValueTransformed) ? null : newValue;
  }

  imgUrlInputEvent($event: any) {
    const newValue = $event.target.value as string | null | undefined;
    if (isNullOrEmpty(newValue)) this._profileImgUrl = null;
    else if (newValue!.indexOf("@") > 0) {
      this._profileImgUrl = null;
      this._profileForm.controls['photoURL'].setValue(null);
    }
    else this._profileImgUrl = $event.target.value;
  }

  imgFromGravatar() {
    const currentUser = this.authService.currentUser;
    if (currentUser && currentUser.emailVerified) {
      this._profileImgUrl = removeSpacesAlsoNonbreakables("https://www.gravatar.com/avatar/"
        + Md5.hashStr(currentUser.email.trim().toLowerCase()) + "?d=mp");
      this._profileForm.controls['photoURL'].setValue(this.profileImgUrl);
    }
  }

  removeImg() {
    this._profileImgUrl = null;
    this._profileForm.controls["photoURL"].setValue(this.profileImgUrl);
    this._profileForm.controls["photoURL"].reset();
  }

  get UsuariNoValidat() { return "Usuario no validado." }
  get HintUsuariNoValidat() {
    return "Recuerde revisar el email y validarlo, y entonces será reconocido como usuario." +
      "Después, refresque la página, y podrá introducir el nombre público."
  }

  async submit() {
    const currentUser = this.authService.currentUser;
    if (currentUser && currentUser.emailVerified) {
      let formValue = this._profileForm.value;
      const password = formValue["password"];
      delete formValue["password"];
      await this.authService.updateUserProfile(password, formValue);
    } else {
      const err = new Error("Ningún usuario ha iniciado la sesión:" + " - " + this.UsuariNoValidat);
      err.name = GUIerrorType.AuthenticationError;
      throw err;
    }
  }

}
