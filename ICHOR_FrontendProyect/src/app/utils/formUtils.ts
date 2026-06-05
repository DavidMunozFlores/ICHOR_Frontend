import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";


export class FormUtils {
  //aqui podemos poner expresiones regulares y cositas que necesitemos para validar

  static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static getTextError(errors: ValidationErrors) {

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'max':
          return `Max value of ${errors['max'].max}`;

        case 'email':
          return `El valor ingresado no es un correo electrónico`;

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return `El campo introducido no es un correo electrónico`

          } else if (errors['pattern'].requiredPattern === FormUtils.namePattern) {
            return `Debe introducir un NOMBRE y un APELLIDO.
            `
          } else if (errors['pattern'].requiredPattern === FormUtils.notOnlySpacesPattern) {
            return `El campo no debe contener espacios`
          }

          return `Error de patrón contra expresión regular`

        case 'passwordsNotEqual':
          return `Las contraseñas no coinciden`;

        case 'emailTaken':
          return `Email ya existente: NO VALIDO`

        case 'reservedName':
          return `Ese valor está reservado`

        case 'hlaInvalid':
          return errors['hlaInvalid'].message;


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

}
