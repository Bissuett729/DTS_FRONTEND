import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { StorageRepository } from '../../domain/repositories/storage.repository';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageRepository = inject(StorageRepository);
  const refreshTokenUseCase = inject(RefreshTokenUseCase);
  
  const token = storageRepository.getItem('accessToken');
  
  if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh-token')) {
    return next(req);
  }
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        const refreshToken = storageRepository.getItem('refreshToken');
        
        if (refreshToken) {
          return refreshTokenUseCase.execute(refreshToken).pipe(
            switchMap(tokens => {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`
                }
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              storageRepository.clear();
              return throwError(() => refreshError);
            })
          );
        }
      }
      
      return throwError(() => error);
    })
  );
};
