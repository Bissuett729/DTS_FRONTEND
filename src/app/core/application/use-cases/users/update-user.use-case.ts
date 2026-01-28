import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IUpdateUserDto } from '../../../domain/interfaces/user.interface';
import { UserApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserUseCase {
  constructor(private userRepository: UserApiRepository) {}

  execute(userId: string, user: IUpdateUserDto): Observable<IUser> {
    return this.userRepository.updateUser(userId, user);
  }
}
