import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { get } from 'lodash';

export interface IMaxSumColumnsParams {
  maxSize: number;
  minSize: number;
  formName: string;
  this: object;
}
export function maxSumColumns(
  { formName, this: component, maxSize, minSize }: IMaxSumColumnsParams,
  crossfieldName: string,
): ValidatorFn {
  return (control: AbstractControl<number>): ValidationErrors | null => {
    const fieldFalue = control.value;
    const form = get(component, formName) as FormGroup;
    if (form) {
      const crossFieldValue: number = form.get(crossfieldName)?.value ?? 0;

      if (crossFieldValue + fieldFalue < minSize) {
        return { minSumRows: true };
      }
      if (crossFieldValue + fieldFalue > maxSize) {
        return { maxSumRows: true };
      }
    }
    return null;
  };
}
