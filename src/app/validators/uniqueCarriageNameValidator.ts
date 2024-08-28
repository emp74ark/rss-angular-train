import { Signal } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { get } from 'lodash';
import { CarriageData } from '../models/carriage';

export interface IUniqueCarriageNameValidatorParams {
  formName: string;
  this: object;
  emulateCodeValidation: boolean;
}
export function uniqueCarriageNameValidator(
  { formName, this: component, emulateCodeValidation }: IUniqueCarriageNameValidatorParams,
  carriagesSig: Signal<CarriageData[]>,
): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const fieldFalue = control.value.trim().toLowerCase();

    if (!fieldFalue) {
      {
        return { nameEmpty: true };
      }
    }

    const fieldFalueMod = fieldFalue.replace(/([^\p{L}0-9])/gu, '');
    const form = get(component, formName) as FormGroup;
    if (form) {
      const code: string = form.get('code')?.value ?? 0;
      const carriages = carriagesSig();
      if (
        emulateCodeValidation &&
        !code &&
        carriages.some(c => {
          const nameValue = c.name.trim().toLowerCase();
          const nameValueMod = nameValue.replace(/([^\p{L}0-9])/gu, '');

          return c.code !== code && nameValueMod === fieldFalueMod;
        })
      ) {
        return { codeDuplicate: true };
      }
      if (
        carriages.some(c => {
          const nameValue = c.name.trim().toLowerCase();
          return c.code !== code && nameValue === fieldFalue;
        })
      ) {
        return { nameDuplicate: true };
      }
    }
    return null;
  };
}
