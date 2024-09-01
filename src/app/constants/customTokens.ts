import { InjectionToken } from '@angular/core';

type TokenValuesType = Record<string, Record<string, string>>;

export const CUSTOM_ERRORS = new InjectionToken<TokenValuesType>('CUSTOM_ERRORS');

type ArrayControlTokenValuesType = Record<string, string>;

export const ARRAY_CONTROL_CUSTOM_ERRORS = new InjectionToken<ArrayControlTokenValuesType>(
  'ARRAY_CONTROL_CUSTOM_ERRORS',
);
