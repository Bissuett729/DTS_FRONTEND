import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IUser, ICreateUserDto } from '../../../domain/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  execute(user: ICreateUserDto): Observable<IUser> {
    return this.userRepository.createUser(user);
  }
}
