import { CanMatchFn, Route, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log.service';
import { map } from 'rxjs';
import { UserRoles } from '../models/auth';

export const adminGuard: CanMatchFn = (route: Route) => {
  const router = inject(Router);
  const logService = inject(LogService);

  return inject(AuthService).$authStatus.pipe(
    map(({ token, role }) => {
      if (token && role === UserRoles.Manager) {
        logService.logMessage(`${route.path} route enabled for admin`, 'info', 'admin guard');
        return true;
      }

      return router.createUrlTree(['/']);
    }),
  );
};
