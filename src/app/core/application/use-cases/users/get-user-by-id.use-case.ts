import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IUser } from '../../../domain/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  execute(userId: string): Observable<IUser> {
    return this.userRepository.getUserById(userId);
  }
}
