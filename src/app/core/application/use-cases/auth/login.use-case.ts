import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ILoginCredentials, ILoginResponse } from '../../../domain/interfaces';
import { AuthApiRepository } from '../../../infrastructure';
import { StorageUseCase } from '../storage';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {
  private authRepository = inject(AuthApiRepository);
  private storageRepository = inject(StorageUseCase);

  execute(credentials: ILoginCredentials): Observable<ILoginResponse> {
    return this.authRepository.login<ILoginCredentials, ILoginResponse>(credentials).pipe(
      tap(response => {
        this.storageRepository.setItem('accessToken', response.accessToken);
        this.storageRepository.setItem('user', JSON.stringify(response.user));
      })
    );
  }
}
