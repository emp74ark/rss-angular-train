import { HttpInterceptorFn } from '@angular/common/http';
import { AuthRoutes } from '../models/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('rsToken');
  if (token && !Object.values(AuthRoutes).some(x => x === req.url)) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedReq);
  }

  return next(req);
};
