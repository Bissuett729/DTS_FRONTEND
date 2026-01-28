import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateDepartmentDto, IDepartment } from '../../../domain';
import { DepartmentsApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class CreateDepartmentUseCase {
  constructor(private departmentsRepository: DepartmentsApiRepository) {}

  execute(department: CreateDepartmentDto): Observable<IDepartment> {
    return this.departmentsRepository.createDepartment(department);
  }
}
