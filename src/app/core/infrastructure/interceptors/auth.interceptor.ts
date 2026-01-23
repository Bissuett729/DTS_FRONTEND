import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { StorageRepository } from '../../domain/repositories/storage.repository';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageRepository = inject(StorageRepository);
  const refreshTokenUseCase = inject(RefreshTokenUseCase);
  
  const token = storageRepository.getItem('accessToken');
  
  // No agregar token a las rutas de autenticación
  if (req.url.includes('/auth/login') || 
      req.url.includes('/auth/refresh') || 
      req.url.includes('/auth/validate-token')) {
    return next(req);
  }
  
  // Agregar token a la petición si existe
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req).pipe(
    catchError((error) => {
      // Si recibimos un 401, intentar refrescar el token
      if (error.status === 401) {
        const currentToken = storageRepository.getItem('accessToken');
        
        if (currentToken) {
          return refreshTokenUseCase.execute(currentToken).pipe(
            switchMap(response => {
              // Reintentar la petición con el nuevo token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                }
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              // Si el refresh falla, limpiar storage y redirigir al login
              storageRepository.clear();
              window.location.href = '/auth/login';
              return throwError(() => refreshError);
            })
          );
        } else {
          // No hay token, redirigir al login
          storageRepository.clear();
          window.location.href = '/auth/login';
        }
      }
      
      return throwError(() => error);
    })
  );
};
