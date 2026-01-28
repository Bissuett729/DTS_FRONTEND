import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment } from '../../../domain';
import { DepartmentsApiRepository } from '../../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class DeleteDepartmentUseCase {

  constructor(private departmentsRepository: DepartmentsApiRepository) { }

  execute(departmentId: string): Observable<IDepartment> {
    return this.departmentsRepository.deleteDepartment(departmentId);
  }
}
