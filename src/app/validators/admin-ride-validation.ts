import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IAdminRIdeTimeValidatorParams } from '../models/admin.routes';

export function adminRideTimeValidator(params: IAdminRIdeTimeValidatorParams): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const controlValue = control.value;
    const date = new Date(controlValue);
    if (date.getTime() !== date.getTime()) {
      return {
        formatError: true,
      };
    }
    const previousDate = new Date(params.previousTime());
    const nextDate = new Date(params.nextTime());

    if (+previousDate - +date >= 0) {
      return {
        lessThanPrevious: true,
      };
    } else if (+date - +nextDate >= 0) {
      return {
        moreThanNext: true,
      };
    }

    return null;
  };
}
