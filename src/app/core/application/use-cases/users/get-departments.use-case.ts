import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { IDepartment } from '../../../domain/interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class GetDepartmentsUseCase {
  constructor(private userRepository: UserRepository) {}

  execute(businessUnit?: string): Observable<IDepartment[]> {
    return this.userRepository.getDepartments(businessUnit);
  }
}
