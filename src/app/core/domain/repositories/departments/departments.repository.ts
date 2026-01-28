import { Observable } from 'rxjs';
import { CreateDepartmentDto, UpdateDepartmentDto } from '../../dtos';
import { IDepartment } from '../../interfaces';

export abstract class DepartmentsRepository {
  abstract getDepartments(): Observable<IDepartment[]>;

  abstract createDepartment(department: CreateDepartmentDto): Observable<IDepartment>;

  abstract updateDepartment(departmentId: string, department: UpdateDepartmentDto): Observable<IDepartment>;

  abstract deleteDepartment(departmentId: string): Observable<IDepartment>;
}