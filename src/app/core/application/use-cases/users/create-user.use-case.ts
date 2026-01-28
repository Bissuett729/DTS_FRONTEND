import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, ICreateUserDto } from '../../../domain/interfaces/user.interface';
import { UserApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class CreateUserUseCase {
  constructor(private userRepository: UserApiRepository) {}

  execute(user: ICreateUserDto): Observable<IUser> {
    return this.userRepository.createUser(user);
  }
}
