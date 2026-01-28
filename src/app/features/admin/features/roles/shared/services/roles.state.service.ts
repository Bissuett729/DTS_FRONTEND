import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { IRole } from '../../../../../../core/domain';
import { GetRolesUseCase } from '../../../../../../core/application';

@Injectable({ providedIn: 'root' })
export class RolesStateService {
  loading = signal<boolean>(false);
  roles = signal<IRole[]>([]);

  constructor(private getRolesUseCase: GetRolesUseCase) { }

  loadRoles(destroy$: Subject<void>): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.getRolesUseCase.execute()
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: (roles) => {
          this.roles.set(roles);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading roles:', error);
          this.loading.set(false);
        }
      });
  }

  addRole(role: IRole): void {
    // Si existe, actualizar; si no, agregar al inicio
    this.roles.update(roles => {
      const index = roles.findIndex(r => r._id === role._id);
      if (index !== -1) {
        // Actualizar el existente
        return roles.map(r =>
          r._id === role._id ? { ...r, ...role } : r
        );
      } else {
        // Agregar al inicio
        return [role, ...roles];
      }
    });
  }

  updateRole(updatedRole: any): void {
    this.roles.update(roles =>
      roles.map(role => {
        const roleIdToMatch = updatedRole._id
        if (role._id === roleIdToMatch) {
          // Merge para preservar relaciones populadas que puedan venir del listado inicial
          return {
            ...role,
            ...updatedRole,
            _id: role._id, // Preservar el _id original
          };
        }
        return role;
      })
    );
  }

  removeRole(roleId: string): void {
    this.roles.update(roles => roles.filter(role => role._id !== roleId));
  }

  clear(): void {
    this.loading.set(false);
  }
}