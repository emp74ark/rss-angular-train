import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LogService } from '../services/log.service';

export const logInterceptor: HttpInterceptorFn = (req, next) => {
  const logService = inject(LogService);
  const message = `METHOD: ${req.method.toUpperCase()} URL: ${req.url} AUTH_HEADERS: ${req.headers.get('Authorization')}`;
  logService.logMessage(message, 'info', 'log interceptor');
  return next(req);
};
