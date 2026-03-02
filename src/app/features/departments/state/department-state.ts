import { Injectable, signal } from '@angular/core';
import { UIDepartment } from '../interfaces/department.interface';

@Injectable({
  providedIn: 'root'
})
export class DepartmentState {
  
  departments = signal<UIDepartment[]>([]);
  
  loadingDepartments = signal<boolean>(false);
  loadingCreateDepartment = signal<boolean>(false);
  loadingUpdateDepartment = signal<boolean>(false);
  loadingDeleteDepartment = signal<boolean>(false);

}
