import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class GetCurrentUserUseCase {
  private authRepository = inject(AuthApiRepository);

  execute(id: string): Observable<any> {
    return this.authRepository.getCurrentUser(id);
  }
}
