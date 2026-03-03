import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../core/application/services/http';
import { environment } from '../../../../environments/environment';
import { finalize } from 'rxjs';
import { AlertService } from '../../../shared';
import { DepartmentState } from '../state/department-state';
import { IDepartment, UIDepartment } from '../interfaces/department.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartmentRequestService {
  private readonly http = inject(HttpService);
  private readonly alert = inject(AlertService);
  private departmentState = inject(DepartmentState);

  private readonly dtsURL = environment.dtsURL;

  getDepartments(loading = true) {
    if (loading) this.departmentState.loadingDepartments.set(true);
    this.http
      .get(`${this.dtsURL}/v1/department`)
      .pipe(
        finalize(() => {
          if (loading) this.departmentState.loadingDepartments.set(false);
        }),
      )
      .subscribe({
        next: (res: any) => {
          const depts: UIDepartment[] = (res as IDepartment[]).map((d) => ({
            ...d,
            addingReason: false,
            newReasonText: '',
            editingName: false,
            editingNameText: '',
          }));
          // console.log('depts:', depts);

          this.departmentState.departments.set(depts);
        },
        error: () => this.alert.error('Error al obtener los departamentos'),
      });
  }

  createDepartment(payload: { department: string; description?: string }) {
    this.departmentState.loadingCreateDepartment.set(true);
    this.http
      .post(`${this.dtsURL}/v1/department`, payload)
      .pipe(finalize(() => this.departmentState.loadingCreateDepartment.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Departamento creado exitosamente');
          this.getDepartments(false);
        },
        error: () => this.alert.error('Error al crear el departamento'),
      });
  }

  addReason(deptId: string, reason: string) {
    this.http.post(`${this.dtsURL}/v1/department/${deptId}/reasons`, { reason }).subscribe({
      next: () => {
        this.alert.success('Razón agregada');
        this.getDepartments(false);
      },
      error: () => this.alert.error('Error al agregar la razón'),
    });
  }

  updateReason(deptId: string, oldReason: string, newReason: string) {
    this.http
      .delete(`${this.dtsURL}/v1/department/${deptId}/reasons/${encodeURIComponent(oldReason)}`)
      .subscribe({
        next: () => {
          this.http
            .post(`${this.dtsURL}/v1/department/${deptId}/reasons`, { reason: newReason })
            .subscribe({
              next: () => {
                this.alert.success('Razón actualizada');
                this.getDepartments(false);
              },
              error: () => this.alert.error('Error al actualizar la razón'),
            });
        },
        error: () => this.alert.error('Error al actualizar la razón'),
      });
  }

  removeReason(deptId: string, reason: string) {
    this.http
      .delete(`${this.dtsURL}/v1/department/${deptId}/reasons/${encodeURIComponent(reason)}`)
      .subscribe({
        next: () => {
          this.alert.success('Razón eliminada');
          this.getDepartments(false);
        },
        error: () => this.alert.error('Error al eliminar la razón'),
      });
  }

  updateDepartment(deptId: string, payload: { department: string; description?: string }) {
    this.departmentState.loadingUpdateDepartment.set(true);
    this.http
      .patch(`${this.dtsURL}/v1/department/${deptId}`, payload)
      .pipe(finalize(() => this.departmentState.loadingUpdateDepartment.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Departamento actualizado');
          this.getDepartments(false);
        },
        error: () => this.alert.error('Error al actualizar el departamento'),
      });
  }

  deleteDepartment(deptId: string) {
    this.departmentState.loadingDeleteDepartment.set(true);
    this.http
      .delete(`${this.dtsURL}/v1/department/${deptId}`)
      .pipe(finalize(() => this.departmentState.loadingDeleteDepartment.set(false)))
      .subscribe({
        next: () => {
          this.alert.success('Departamento eliminado');
          this.getDepartments(false);
        },
        error: () => this.alert.error('Error al eliminar el departamento'),
      });
  }
}
