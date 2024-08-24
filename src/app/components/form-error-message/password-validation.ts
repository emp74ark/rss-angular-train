import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidation(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length < 8) {
      return { minlength: true };
    }

    return null;
  };
}

export function passwordMismatch(data: object): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if ('form' in data) {
      const form = data.form as FormGroup;
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirmPassword')?.value;

      if (control.value && password !== confirmPassword) {
        return { mismatch: true };
      }
    }

    return null;
  };
}
