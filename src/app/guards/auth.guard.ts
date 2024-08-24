import { CanMatchFn, Route, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log.service';
import { map } from 'rxjs';

export const authGuard: CanMatchFn = (route: Route) => {
  const router = inject(Router);
  const logService = inject(LogService);

  return inject(AuthService).$authStatus.pipe(
    map(({ token }) => {
      console.log('route', route);
      console.log('route', token);
      console.log(
        `!token && ['signup', 'signin'].includes(route.path ?? '')`,
        !token && ['signup', 'signin'].includes(route.path ?? ''),
      );
      if (!token && ['signup', 'signin'].includes(route.path ?? '')) {
        logService.logMessage('auth route enabled for non-authenticated', 'info', 'auth guard');
        return true;
      }

      console.log(`token && route.path?.startsWith('auth')`, token && route.path?.startsWith('auth'));
      if (token && ['signup', 'signin'].includes(route.path ?? '')) {
        logService.logMessage('auth route disabled for authenticated', 'info', 'auth guard');
        return router.createUrlTree(['/']);
      }

      if (token) {
        logService.logMessage(`${route.path} route enabled for authenticated`, 'info', 'auth guard');
        return true;
      }

      return router.createUrlTree(['/signin']);
    }),
  );
};
