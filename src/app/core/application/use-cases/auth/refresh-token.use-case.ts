import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { StorageRepository } from '../../../domain/repositories/storage.repository';
import { IRefreshTokenResponse } from '../../../domain';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenUseCase {
  private authRepository = inject(AuthRepository);
  private storageRepository = inject(StorageRepository);

  execute(accessToken: string): Observable<IRefreshTokenResponse> {
    return this.authRepository.refreshToken<IRefreshTokenResponse>(accessToken).pipe(
      tap(response => {
        // Guardar el nuevo token
        this.storageRepository.setItem('accessToken', response.accessToken);
        // Guardar la información del usuario actualizada
        this.storageRepository.setItem('user', JSON.stringify(response.user));
      })
    );
  }
}
