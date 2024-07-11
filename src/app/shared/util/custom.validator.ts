import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { plainLowerCaseString } from './util';

/**
 * Code from https://github.com/ionicthemes/ionic-forms-and-validations/blob/master/src/app/validators/password.validator.ts
 * @export
 * @class PasswordValidator
 */
export class PasswordValidator {

    // Inspired on: http://plnkr.co/edit/Zcbg2T3tOxYmhxs7vaAm?p=preview
    static areEqual(formGroup: AbstractControl) {
      const theFormGroup = formGroup as FormGroup;
      if (!!theFormGroup) {
        let val;
        let valid = true;
    
        for (let key in theFormGroup.controls) {
          if (theFormGroup.controls.hasOwnProperty(key)) {
            let control: FormControl = <FormControl>theFormGroup.controls[key];
    
            if (val === undefined) {
              val = control.value
            } else {
              if (val !== control.value) {
                valid = false;
                break;
              }
            }
          }
        }
    
        if (valid) {
          return null;
        }
      }
  
      return { areEqual: true };
    }

    static isEqual(FormControl: AbstractControl, value: any) {
      const valid = (FormControl.value == value)
      if (valid) return null;
      else return { isEqual: true };
    }

  }
  
/**
 * Async validator
 * from https://www.thisdot.co/blog/using-custom-async-validators-in-angular-reactive-forms
 * by Daian Scuarissi
 * @export
 * @class PasswordValidator
 */
export class DisplayNameValidator {

    static createValidator(authService: AuthService): AsyncValidatorFn {
        const checkedInvalidDisplayNames: string[] = [];
        const checkedValidDisplayNames: string[] = [];
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (!control.dirty) return of(null)
            const normalizedDisplayName = plainLowerCaseString(control.value);
            if (checkedInvalidDisplayNames.indexOf(normalizedDisplayName) < 0) {
                if (checkedValidDisplayNames.indexOf(normalizedDisplayName) < 0) {
                    return authService.validUserNewDisplayName(control.value)
                        .pipe(
                            map((result: boolean) => {
                                if (result) {
                                    checkedValidDisplayNames.push(normalizedDisplayName);
                                    return null;
                                } else {
                                    checkedInvalidDisplayNames.push(normalizedDisplayName);
                                    return { displayNameAlreadyExists: true } as ValidationErrors;
                                }
                            })
                        );
                } else return of(null);
            } else { return of({ displayNameAlreadyExists: true } as ValidationErrors); }
        }
    }
}


/**
* Collection of reusable RegExps
*/
export const regExps: { [key: string]: RegExp } = {
    password: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\\-\x22\x26\/\(\)'¡¿·!@#~$%=?¿ _:;+*.,]).{8,24}/
};
