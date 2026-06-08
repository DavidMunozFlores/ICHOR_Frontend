import { AbstractControl, AsyncValidatorFn, FormArray, FormGroup, ValidationErrors } from "@angular/forms";
import { OrganPetitionService } from "../services/OrganPetitions.service";
import { inject } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";


export class FormUtils {
  //aqui podemos poner expresiones regulares y cositas que necesitemos para validar



  static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static passwordRegisterPattern = '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,127}$';

  static getTextError(errors: ValidationErrors) {

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Required field';

        case 'minlength':
          return `Minimum length of ${errors['minlength'].requiredLength} characteres`;

        case 'min':
          return `Minimum value of ${errors['min'].min}`;

        case 'max':
          return `Maximum value of ${errors['max'].max}`;

        case 'email':
          return `The input value it is not an email`;

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return `The input value it is not an email`

          } else if (errors['pattern'].requiredPattern === FormUtils.namePattern) {
            return `First Name and Last Name are mandatory.
            `
          } else if (errors['pattern'].requiredPattern === FormUtils.notOnlySpacesPattern) {
            return `The input cannot contain spaces`
          }

          return `Regular expression error`

        case 'passwordsNotEqual':
          return `The passwords are not equals`;

        case 'emailTaken':
          return `Email already exists: NOT VALID`

        case 'reservedName':
          return `This value is reserved`

        case 'hlaInvalid':
          return errors['hlaInvalid'].message;

        case 'patientNotFound':
          return `Not patient found with such identification.`

        default:
          return `Error de validación no controlado ${key}`;
      }
    }

    return null;
  }


  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      form.controls[fieldName].errors &&
      form.controls[fieldName].touched
    );
  }


  static getFieldError(form: FormGroup, fieldName: string): string | null {

    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};
    return FormUtils.getTextError(errors);

  }


  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors &&
      formArray.controls[index].touched
    )
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {

    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};
    return FormUtils.getTextError(errors);

  }

  static isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string) {
    return (formGroup: AbstractControl) => {

      const fieldOneValue = formGroup.get(fieldOne)?.value;
      const fieldTwoValue = formGroup.get(fieldTwo)?.value;

      return fieldOneValue === fieldTwoValue ? null : { passwordsNotEqual: true };

    }
  }


  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {

    console.log('validando contra servidor');

    // await sleep();

    const formValue = control.value;

    if (formValue === 'david@gmail.com') {
      return {
        emailTaken: true
      };
    }

    return null;

  }


  static notSpecialName(control: AbstractControl): ValidationErrors | null {

    const controlValue = control.value;

    if (controlValue === 'managerCreator') {
      return {
        reservedName: true
      }
    }

    return null;
  }


  static patientExistsByIdentification(organPetitionService: OrganPetitionService): AsyncValidatorFn {


    return (control: AbstractControl): Observable<ValidationErrors | null> => {

    const patientIdentification = control.value

    if(!control.value){
      return of(null);
    }

    return organPetitionService.getPatientByIdentification(patientIdentification).pipe(
       map(() => null),
      catchError(() =>
        of({ patientNotFound: true })
      )
    );
  }

  }

}
