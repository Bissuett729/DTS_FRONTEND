import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IUser } from '../../../domain/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ApplyToolTemplateUseCase {
  private userRepository = inject(UserRepository);

  execute(userId: string, templateId: string): Observable<IUser> {
    return this.userRepository.applyToolTemplate(userId, templateId);
  }
}
