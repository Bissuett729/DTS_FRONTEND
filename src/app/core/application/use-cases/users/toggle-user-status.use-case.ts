import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../../domain/interfaces/user.interface';
import { UserApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class ToggleUserStatusUseCase {
  constructor(private userRepository: UserApiRepository) {}

  execute(userId: string, active: boolean): Observable<IUser> {
    return this.userRepository.toggleUserStatus(userId, active);
  }
}
