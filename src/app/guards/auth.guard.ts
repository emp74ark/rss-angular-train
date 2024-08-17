import { CanMatchFn, Route, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log.service';

export const authGuard: CanMatchFn = (route: Route) => {
  const authToken = inject(AuthService).$authStatus.getValue().token;
  const router = inject(Router);
  const logService = inject(LogService);

  if (!authToken && route.path?.startsWith('auth')) {
    logService.logMessage('auth route enabled for non-authenticated', 'info', 'auth guard');
    return true
  }

  if (authToken && route.path?.startsWith('auth')) {
    logService.logMessage('auth route disabled for authenticated', 'info', 'auth guard');
    return router.createUrlTree(['/']);
  }

  if (authToken) {
    logService.logMessage(`${route.path} route enabled for authenticated`, 'info', 'auth guard');
    return true;
  }

  return router.createUrlTree(['/auth']);
};
