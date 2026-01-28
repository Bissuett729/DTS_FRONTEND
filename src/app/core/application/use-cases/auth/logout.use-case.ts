import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ILogoutResponse } from '../../../domain/repositories/auth/auth.repository';
import { AuthApiRepository } from '../../../infrastructure';
import { StorageUseCase } from '../..';

@Injectable({
  providedIn: 'root'
})
export class LogoutUseCase {
  private authRepository = inject(AuthApiRepository);
  private storageRepository = inject(StorageUseCase);

  execute(token: string): Observable<ILogoutResponse> {
    return this.authRepository.logout(token).pipe(
      tap((response) => {
        // Solo limpiar si el logout fue exitoso
        if (response.success) {
          this.storageRepository.removeItem('accessToken');
          this.storageRepository.removeItem('refreshToken');
          this.storageRepository.removeItem('user');
          console.log('Logout successful:', response.message);
        }
      })
    );
  }
}
