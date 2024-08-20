import { InjectionToken } from '@angular/core';

type TokenValuesType = Record<string, Record<string, string>>;

export const CUSTOM_ERRORS = new InjectionToken<TokenValuesType>('CUSTOM_ERRORS');
