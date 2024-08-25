import {} from '@angular/core';
import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface IFieldsEquivalentPreviousValidatorParams {
  fields: Record<string, string>;
  validate: boolean;
  this: object;
}
export function fieldsEquivalentPreviousValidator(params: IFieldsEquivalentPreviousValidatorParams): ValidatorFn {
  return (): ValidationErrors | null => {
    if (!params.validate) {
      return null;
    }

    if ('form' in params.this) {
      const form = params.this.form as FormGroup;

      if (
        Object.entries(params.fields).some(([key, value]) => {
          return form.get(key)?.value !== value;
        })
      ) {
        return null;
      }
    }
    return { userNotFound: true };
  };
}
