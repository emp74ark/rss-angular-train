import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from '../../environments/environment';

export const logInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.production) {
    console.log(`METHOD: ${req.method.toUpperCase()} URL: ${req.url} AUTH_HEADERS: ${req.headers.get('Authorization')}`);
  }
  return next(req);
};
