import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DepartmentsRepository } from '../../../domain/repositories';
import { CreateDepartmentDto, IDepartment, UpdateDepartmentDto } from '../../../domain';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsApiRepository extends DepartmentsRepository {
  private http = inject(HttpClient);
  private departmentsURL = `${environment.userURL}/v1/departments`;

  getDepartments(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(this.departmentsURL);
  }

  createDepartment(department: CreateDepartmentDto): Observable<IDepartment> {
    return this.http.post<IDepartment>(this.departmentsURL, department);
  }

  updateDepartment(departmentId: string, department: UpdateDepartmentDto): Observable<IDepartment> {
    return this.http.put<IDepartment>(`${this.departmentsURL}/${departmentId}`, department);
  }

  deleteDepartment(departmentId: string): Observable<IDepartment> {
    return this.http.delete<IDepartment>(`${this.departmentsURL}/${departmentId}`);
  }
}

export const DEPARTMENTS_REPOSITORY_PROVIDER = {
  provide: DepartmentsRepository,
  useExisting: DepartmentsApiRepository
};
