import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { StorageRepository } from '../../../domain/repositories/storage.repository';

@Injectable({
  providedIn: 'root'
})
export class LogoutUseCase {
  private authRepository = inject(AuthRepository);
  private storageRepository = inject(StorageRepository);

  execute(): Observable<void> {
    return this.authRepository.logout().pipe(
      tap(() => {
        this.storageRepository.removeItem('accessToken');
        this.storageRepository.removeItem('refreshToken');
        this.storageRepository.removeItem('user');
      })
    );
  }
}
