import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IUser } from '../../../domain/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ToggleUserStatusUseCase {
  constructor(private userRepository: UserRepository) {}

  execute(userId: string, active: boolean): Observable<IUser> {
    return this.userRepository.toggleUserStatus(userId, active);
  }
}
