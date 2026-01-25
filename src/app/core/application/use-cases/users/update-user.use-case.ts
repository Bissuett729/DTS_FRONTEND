import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IUser, IUpdateUserDto } from '../../../domain/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  execute(userId: string, user: IUpdateUserDto): Observable<IUser> {
    return this.userRepository.updateUser(userId, user);
  }
}
