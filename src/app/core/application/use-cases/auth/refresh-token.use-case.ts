import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IRefreshTokenResponse } from '../../../domain';
import { AuthApiRepository } from '../../../infrastructure';
import { StorageUseCase } from '../..';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenUseCase {
  private authRepository = inject(AuthApiRepository);
  private storageRepository = inject(StorageUseCase);

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
