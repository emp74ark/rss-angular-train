import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateTimeValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  const dateObj = new Date(value);

  if (dateObj.getTime() !== dateObj.getTime()) {
    return { dateTime: true };
  }

  if (dateObj < new Date()) {
    return { dateInPast: true };
  }

  return null;
}
