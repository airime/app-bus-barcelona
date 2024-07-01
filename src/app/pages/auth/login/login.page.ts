import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonList, IonItem, IonLabel, IonInput, IonInputPasswordToggle, IonButton, 
         IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { AuthService } from '../../../shared/services/auth.service';
import { GUIerrorType } from '../../../shared/util/errors';
import { regExps } from '../../../shared/util/custom.validator';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [ReactiveFormsModule, IonCardTitle, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
            IonLabel, IonList, IonItem, IonInput, IonInputPasswordToggle, IonButton]
})
export class LoginPage  implements OnInit {
  hidePassword: boolean;
  credentials!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.hidePassword = true;
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
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

  async login() {
    const user = await this.authService.login(this.credentials.value);
    if (user) {
      this.router.navigateByUrl('private/home', { replaceUrl: true });
    } else {
      const err = new Error("A fallado la operación de login. Por favor, pruebe de nuevo!");
      err.name = GUIerrorType.FormError;
      throw err;
    }
  }

  private get pattern() {
    return regExps['password'];
  }

}
