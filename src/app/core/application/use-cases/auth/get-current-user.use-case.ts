import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../../domain/repositories/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentUserUseCase {
  private authRepository = inject(AuthRepository);

  execute(): Observable<any> {
    return this.authRepository.getCurrentUser();
  }
}
