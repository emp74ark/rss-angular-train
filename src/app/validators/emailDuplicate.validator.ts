import {} from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailDuplicateValidator(field: { email: string; validate: boolean }): ValidatorFn {
  return (i: AbstractControl): ValidationErrors | null => {
    if (!field.email || !field.validate) {
      return null;
    }
    if (i.value === field.email) {
      return { emailDuplicateValidate: `This email is already in use` };
    }

    return null;
  };
}
