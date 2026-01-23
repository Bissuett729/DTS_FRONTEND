import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository, ILogoutResponse } from '../../../domain/repositories/auth.repository';
import { StorageRepository } from '../../../domain/repositories/storage.repository';

@Injectable({
  providedIn: 'root'
})
export class LogoutUseCase {
  private authRepository = inject(AuthRepository);
  private storageRepository = inject(StorageRepository);

  execute(): Observable<ILogoutResponse> {
    return this.authRepository.logout().pipe(
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
