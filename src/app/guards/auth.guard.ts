import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = () => {
  const authToken = inject(AuthService).$authStatus.getValue().token;
  const router = inject(Router);

  if (authToken) {
    return true;
  } else {
    // todo: replace route with the correct one
    return router.createUrlTree(['/auth']);
  }
};
