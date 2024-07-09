import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonList, IonItem, IonLabel, IonInput, IonInputPasswordToggle, IonButton, 
         IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { MenuComponent } from '../../../shared/components/menu/menu.component';
import { AuthService } from '../../../shared/services/auth.service';
import { GUIerrorType } from '../../../shared/util/errors';
import { regExps } from '../../../shared/util/custom.validator';
import { isNullOrEmpty } from 'src/app/shared/util/util';
import { userProfile } from 'src/app/shared/model/userProfile';
import { MyCustomAnimation } from 'src/app/shared/services/myCustom.animation';

@Component({
  selector: 'app-resend-verification',
  standalone: true,
  templateUrl: './resend-verification.page.html',
  styleUrls: ['./resend-verification.page.scss'],
  imports: [ReactiveFormsModule, MenuComponent, IonCardTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
            IonLabel, IonList, IonItem, IonInput, IonInputPasswordToggle, IonButton]
})
export class ResendVerificationPage implements OnInit {
  wait: boolean;
  credentials!: FormGroup;
  private currentUser!: userProfile | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private myCustomAnimation: MyCustomAnimation
  ) { 
    this.authService.refreshCurrentUser().then(usrProfile => this.currentUser = usrProfile);
    this.wait = false;
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  get displayNameDefined() {
    return !isNullOrEmpty(this.currentUser?.displayName);
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
      Validators.minLength(8), Validators.maxLength(24),
      Validators.pattern(this.pattern)]]
    });
  }

  obrirCondicions() {
    // Converts the route into a string that can be used 
    // with the window.open() function
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`service-terms`])
    );
    window.open(url, '_blank');
  }

  recovery() {
    this.navCtrl.navigateForward('/recovery',
                                 { animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  goBack() {
    this.navCtrl.back({ animated: true, animation: this.myCustomAnimation.customAnimation });
  }

  async submit() {
    try {
      this.wait = true;
      if (this.credentials.valid) {
        const user = await this.authService.resendEmailVerification(this.credentials.value);
        if (user) {
          this.router.navigateByUrl('private/home', { replaceUrl: true });
        } else {
          const err = new Error("A fallado la operación de login. Por favor, pruebe de nuevo!");
          err.name = GUIerrorType.FormError;
          throw err;
        }
      } else {
        const err = new Error("Error inesperado. Puede que no se cumplan las condiciones del formulario, o se habrá dado un error en el servicio.");
        err.name = GUIerrorType.FormError;
        throw err;
      }
    } finally {
      this.wait = false;
    }
  }

  private get pattern() {
    return regExps['password'];
  }

}
