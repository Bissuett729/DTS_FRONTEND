import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../../domain/interfaces/user.interface';
import { UserApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class ApplyToolTemplateUseCase {
  private userRepository = inject(UserApiRepository);

  execute(userId: string, templateId: string): Observable<IUser> {
    return this.userRepository.applyToolTemplate(userId, templateId);
  }
}
