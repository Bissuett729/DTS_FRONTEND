import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IDepartment } from '../../../../../../core/domain';
import { GetDepartmentsUseCase } from '../../../../../../core/application';

@Injectable({ providedIn: 'root' })
export class DepartmentsStateService {
  loading = signal<boolean>(false);
  departments = signal<IDepartment[]>([]);

  constructor(private getDepartmentsUseCase: GetDepartmentsUseCase) { }

  loadDepartments(destroy$: Subject<void>): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.getDepartmentsUseCase.execute()
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: (grouped) => {
          this.departments.set(grouped);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading departments:', error);
          this.loading.set(false);
        }
      });
  }
  
  addDepartment(department: IDepartment): void {
    // Si existe, actualizar; si no, agregar al inicio
    this.departments.update(departments => {
      const index = departments.findIndex(d => d._id === department._id);
      if (index !== -1) {
        // Actualizar el existente
        return departments.map(d =>
          d._id === department._id ? { ...d, ...department } : d
        );
      } else {
        // Agregar al inicio
        return [...departments, department];
      }
    });
  }

  updateDepartment(updatedDepartment: any): void {
    this.departments.update(departments =>
      departments.map(d => {
        const departmentIdToMatch = updatedDepartment._id
        if (d._id === departmentIdToMatch) {
          // Merge para preservar relaciones populadas que puedan venir del listado inicial
          return {
            ...d,
            ...updatedDepartment,
            _id: d._id, // Preservar el _id original
          };
        }
        return d;
      })
    );
  }

  removeDepartment(departmentId: string): void {
    this.departments.update(departments => departments.filter(d => d._id !== departmentId));
  }

  clear(): void {
    this.loading.set(false);
  }
}