import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IRole } from '../../../domain/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class GetRolesUseCase {
  constructor(private userRepository: UserRepository) {}

  execute(): Observable<IRole[]> {
    return this.userRepository.getRoles();
  }
}
