import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GetUsersUseCase } from '../../../core/application/use-cases/users';
import { IUser, IUserFilters } from '../../../core/domain/interfaces/user.interface';

/**
 * Servicio de estado para el módulo de usuarios
 * Maneja la lógica de negocio, carga de datos y estado del componente
 */
@Injectable()
export class UsersStateService {
  // Signals - Estado reactivo
  users = signal<IUser[]>([]);
  loading = signal<boolean>(false);
  totalUsers = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalPages = signal<number>(0);

  constructor(private getUsersUseCase: GetUsersUseCase) {}

  /**
   * Cargar lista de usuarios con filtros
   */
  loadUsers(filters: IUserFilters, destroy$: Subject<void>): void {
    if (this.loading()) return;

    this.loading.set(true);

    const requestFilters: IUserFilters = {
      ...filters,
      page: this.currentPage(),
      limit: this.pageSize()
    };

    this.getUsersUseCase.execute(requestFilters)
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: (response) => {
          this.users.set(response.users);
          this.totalUsers.set(response.total);
          this.totalPages.set(response.totalPages);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading.set(false);
        }
      });
  }

  /**
   * Agregar un nuevo usuario al inicio de la lista
   */
  addUser(user: IUser): void {
    this.users.update(users => [user, ...users]);
    this.totalUsers.update(total => total + 1);
  }

  /**
   * Actualizar un usuario existente en la lista
   */
  updateUser(updatedUser: IUser): void {
    this.users.update(users =>
      users.map(u => u._id === updatedUser._id ? updatedUser : u)
    );
  }

  /**
   * Eliminar un usuario de la lista
   */
  removeUser(userId: string): void {
    this.users.update(users => users.filter(u => u._id !== userId));
    this.totalUsers.update(total => total - 1);
  }

  /**
   * Cambiar el estado activo/inactivo de un usuario
   */
  toggleUserStatus(userId: string, active: boolean): void {
    this.users.update(users =>
      users.map(u => u._id === userId ? { ...u, active } : u)
    );
  }

  /**
   * Cambiar de página
   */
  setPage(page: number): void {
    this.currentPage.set(page);
  }

  /**
   * Reiniciar paginación a la primera página
   */
  resetPagination(): void {
    this.currentPage.set(1);
  }

  /**
   * Limpiar todos los datos
   */
  clear(): void {
    this.users.set([]);
    this.loading.set(false);
    this.totalUsers.set(0);
    this.currentPage.set(1);
    this.totalPages.set(0);
  }
}
