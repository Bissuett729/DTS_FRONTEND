import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { StorageRepository } from '../../../domain/repositories/storage.repository';
import { ILoginCredentials, ILoginResponse } from '../../../domain/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {
  private authRepository = inject(AuthRepository);
  private storageRepository = inject(StorageRepository);

  execute(credentials: ILoginCredentials): Observable<ILoginResponse> {
    return this.authRepository.login<ILoginCredentials, ILoginResponse>(credentials).pipe(
      tap(response => {
        this.storageRepository.setItem('accessToken', response.accessToken);
        this.storageRepository.setItem('user', JSON.stringify(response.user));
      })
    );
  }
}
