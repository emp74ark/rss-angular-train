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
      if (!token && route.path?.startsWith('auth')) {
        logService.logMessage('auth route enabled for non-authenticated', 'info', 'auth guard');
        return true;
      }

      if (token && route.path?.startsWith('auth')) {
        logService.logMessage('auth route disabled for authenticated', 'info', 'auth guard');
        return router.createUrlTree(['/']);
      }

      if (token) {
        logService.logMessage(`${route.path} route enabled for authenticated`, 'info', 'auth guard');
        return true;
      }

      return router.createUrlTree(['/auth']);
    }),
  );
};
