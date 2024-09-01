import { AbstractControl, FormArray, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IAdminRoutesStationListValidatorParams, IStation } from '../models/admin.routes';

export function arrayLengthValidator(control: AbstractControl): ValidationErrors | null {
  if (control?.value?.length >= 3) {
    return null;
  }
  return { minLength: true };
}

export function adminRoutesStationsValidator(params: IAdminRoutesStationListValidatorParams): ValidatorFn {
  return (control: AbstractControl<IStation | null>): ValidationErrors | null => {
    if (!control.parent || !params.stationsRecord) {
      return null;
    }

    const parent = control.parent as FormArray<FormControl<IStation | null>>;
    const controlValue = control.value;

    if (controlValue) {
      let duplicateError: ValidationErrors | null = null;
      let currentIndex = 0;
      parent.controls.some((prevControl, index) => {
        if (prevControl === control) {
          currentIndex = index;
          return true;
        }

        if (prevControl.value && prevControl.value.id === controlValue.id) {
          duplicateError = {
            duplicateStation: true,
          };
        }

        return false;
      });

      if (duplicateError) {
        return duplicateError;
      }

      if (!currentIndex) {
        return null;
      }

      const prevIndex = currentIndex - 1;
      const previousControl = parent.controls[prevIndex];
      const previousControlValue = previousControl.value;

      const prevControlConnection =
        previousControlValue !== null ? params.stationsRecord()[previousControlValue.id] : null;

      if (!prevControlConnection || !prevControlConnection.some(value => controlValue.id === value.id)) {
        return {
          connectionLost: true,
        };
      }
    }

    return null;
  };
}
