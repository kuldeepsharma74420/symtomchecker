import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token && token.trim()) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token.trim()}`
        }
      });
      return next(clonedRequest).pipe(
        catchError((error) => {
          if (error.status === 401) {
            authService.logout();
          }
          throw error;
        })
      );
    }

    return next(req);
  } catch (error) {
    console.error('JWT Interceptor error:', error);
    return next(req);
  }
};