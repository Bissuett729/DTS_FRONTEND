import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IUserListResponse, IUserFilters } from '../../../domain/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class GetUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  execute(filters?: IUserFilters): Observable<IUserListResponse> {
    return this.userRepository.getUsers(filters);
  }
}
