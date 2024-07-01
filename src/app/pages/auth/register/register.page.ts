import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent,
          IonList, IonItem, IonLabel, IonInput, IonInputPasswordToggle, IonButton, IonItemGroup, IonItemDivider } from '@ionic/angular/standalone';

import { AuthService } from '../../../shared/services/auth.service';
import { PasswordValidator, regExps } from '../../../shared/util/custom.validator';
import { GUIerrorType } from '../../../shared/util/errors';
import { isNull } from 'src/app/shared/util/util';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonItemDivider, ReactiveFormsModule, RouterLink,
    IonItemGroup, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonInput, IonInputPasswordToggle, IonButton ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterPage implements OnInit {
  credentials!: FormGroup;
  wait: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.wait = false;
  }
  
  get pattern() {
    return regExps['password'];
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  get emailGroupOk() {
    const emailGroup = this.credentials.controls["emailGroup"];
    return !emailGroup?.hasError('areEqual');
  }

  get passwordGroupOk() {
    const passwordGroup = this.credentials.controls["passwordGroup"];
    return !passwordGroup?.hasError('areEqual');
  }

  ngOnInit() {
    
    const emailGroup = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      emailAgain: new FormControl('', [Validators.required, Validators.email])
    }, { validators: PasswordValidator.areEqual });
    const passwordGroup = this.fb.group({
      password: new FormControl('', [Validators.required,
          Validators.minLength(8), Validators.maxLength(24),
          Validators.pattern(this.pattern)]),
      passwordAgain: new FormControl('', [Validators.required,
          Validators.minLength(8), Validators.maxLength(24),
          Validators.pattern(this.pattern)]),
    }, { validators: PasswordValidator.areEqual });
    this.credentials = this.fb.group({
      emailGroup: emailGroup,
      passwordGroup: passwordGroup
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
  
  async register() {
    try {
      this.wait = true;
      this.credentials.controls["emailGroup"].hasError
      if (this.credentials.valid) {
        const emailGroup: FormGroup = this.credentials.controls["emailGroup"] as FormGroup;
        const passwordGroup: FormGroup = this.credentials.controls["passwordGroup"] as FormGroup;
        let credentials = { 
          email: emailGroup.controls["email"].value,
          password: passwordGroup.controls["password"].value
        };
        const user = await this.authService.register(credentials);
        if (user) {
          passwordGroup.controls["password"].setValue("");
          passwordGroup.controls["passwordAgain"].setValue("");
          this.router.navigateByUrl('user-profile', { replaceUrl: true });
        } else {
          const err = new Error("Ha fallado la operación de registro. Por favor, pruebe de nuevo.");
          err.name = GUIerrorType.AuthenticationError;
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

}
