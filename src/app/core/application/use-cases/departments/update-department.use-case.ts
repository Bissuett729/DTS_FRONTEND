import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment, UpdateDepartmentDto } from '../../../domain';
import { DepartmentsApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class UpdateDepartmentUseCase {
  constructor(private departmentsRepository: DepartmentsApiRepository) { }

  execute(departmentId: string, department: UpdateDepartmentDto): Observable<IDepartment> {
    return this.departmentsRepository.updateDepartment(departmentId, department);
  }
}
