import { Signal } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface IStationsValidatorParams {
  this: object;
}
export function stationsTheSame(params: IStationsValidatorParams): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if ('form' in params.this) {
      const form = params.this.form as FormGroup;

      const from: string = form.get('from')?.value;
      const to: string = control.value;

      if (from && to && from.trim().toLowerCase() === to.trim().toLowerCase()) {
        return { stationsTheSame: true };
      }
    }

    return null;
  };
}

export interface IStationListValidatorParams {
  this: object;
  cityList: Signal<string[]>;
}

export function stationsNotInListTheSame(params: IStationListValidatorParams): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const lowerFieldValue = control.value.trim().toLowerCase();
    const cityList = params.cityList();

    if (!cityList.some(city => city.trim().toLowerCase() === lowerFieldValue)) {
      return { stationNotInList: true };
    }
    return null;
  };
}
