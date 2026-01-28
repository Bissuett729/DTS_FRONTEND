import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class DeleteUserUseCase {
  constructor(private userRepository: UserApiRepository) {}

  execute(userId: string): Observable<void> {
    return this.userRepository.deleteUser(userId);
  }
}
