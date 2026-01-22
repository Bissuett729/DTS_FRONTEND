import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { StorageRepository } from '../../../domain/repositories/storage.repository';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenUseCase {
  private authRepository = inject(AuthRepository);
  private storageRepository = inject(StorageRepository);

  execute(refreshToken: string): Observable<any> {
    return this.authRepository.refreshToken(refreshToken).pipe(
      tap(tokens => {
        this.storageRepository.setItem('accessToken', tokens.accessToken);
        this.storageRepository.setItem('refreshToken', tokens.refreshToken);
      })
    );
  }
}
