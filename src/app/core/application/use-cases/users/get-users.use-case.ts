import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserListResponse, IUserFilters } from '../../../domain/interfaces/user.interface';
import { UserApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class GetUsersUseCase {
  constructor(private userRepository: UserApiRepository) {}

  execute(filters?: IUserFilters): Observable<IUserListResponse> {
    return this.userRepository.getUsers(filters);
  }
}
