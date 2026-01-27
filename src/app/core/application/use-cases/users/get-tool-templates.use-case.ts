import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IToolTemplate } from '../../../domain/interfaces/user.interface';
import { UserRepository } from '../../../domain/repositories/user.repository';

@Injectable({
  providedIn: 'root',
})
export class GetToolTemplatesUseCase {
  private userRepository = inject(UserRepository);

  execute(): Observable<IToolTemplate[]> {
    return this.userRepository.getToolTemplates();
  }
}
