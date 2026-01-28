import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../../domain/interfaces/user.interface';
import { UserApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class GetUserByIdUseCase {
  constructor(private userRepository: UserApiRepository) {}

  execute(userId: string): Observable<IUser> {
    return this.userRepository.getUserById(userId);
  }
}
