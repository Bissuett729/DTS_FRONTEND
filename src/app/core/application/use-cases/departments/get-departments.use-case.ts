import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment } from '../../../domain';
import { DepartmentsApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class GetDepartmentsUseCase {
  constructor(private departmentsRepository: DepartmentsApiRepository) {}

  execute(): Observable<IDepartment[]> {
    return this.departmentsRepository.getDepartments();
  }
}
