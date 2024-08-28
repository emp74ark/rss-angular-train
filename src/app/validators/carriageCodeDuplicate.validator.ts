import {} from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function carriageCodeDuplicateValidator(field: { code: string; validate: boolean }): ValidatorFn {
  return (i: AbstractControl): ValidationErrors | null => {
    if (!field.code || !field.validate) {
      return null;
    }
    if (i.value === field.code) {
      return { carriageCodeDuplicateValidate: `Carriage code already exists` };
    }

    return null;
  };
}
