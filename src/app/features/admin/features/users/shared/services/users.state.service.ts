import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GetUsersUseCase, UpdateUserUseCase } from '../../../../../../core/application/use-cases/users';
import { IUser, IUserFilters, IUpdateUserDto } from '../../../../../../core/domain';

@Injectable({ providedIn: 'root' })
export class UsersStateService {
  users = signal<IUser[]>([]);
  loading = signal<boolean>(false);
  totalUsers = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalPages = signal<number>(0);

  constructor(
    private getUsersUseCase: GetUsersUseCase,
    private updateUserUseCase: UpdateUserUseCase
  ) { }

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
          this.users.set(response?.users);
          this.totalUsers.set(response?.total);
          this.totalPages.set(response?.totalPages);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading.set(false);
        }
      });
  }

  addUser(user: IUser): void {
    // Si existe, actualizar; si no, agregar al inicio
    this.users.update(users => {
      const index = users.findIndex(u => u._id === user._id);
      if (index !== -1) {
        // Actualizar el existente
        return users.map(u =>
          u._id === user._id ? { ...u, ...user } : u
        );
      } else {
        // Agregar al inicio
        return [user, ...users];
      }
    });
    this.totalUsers.update(total => total + 1);
  }

  updateUser(updatedUser: IUser | any): void {
    this.users.update(users =>
      users.map(u => {
        const userIdToMatch = updatedUser._id
        if (u._id === userIdToMatch) {
          // Merge para preservar relaciones populadas que puedan venir del listado inicial
          return {
            ...u,
            ...updatedUser,
            _id: u._id, // Preservar el _id original
          };
        }
        return u;
      })
    );
  }

  updateUserInList(updatedUser: IUser): void {
    this.updateUser(updatedUser);
  }

  updateUserById(userId: string, data: IUpdateUserDto, destroy$: Subject<void>): void {
    this.updateUserUseCase.execute(userId, data)
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: (updatedUser) => {
          this.updateUser(updatedUser);
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
  }

  removeUser(userId: string): void {
    this.users.update(users => users.filter(u => u._id !== userId));
    this.totalUsers.update(total => total - 1);
  }

  toggleUserStatus(userId: string, active: boolean): void {
    this.users.update(users =>
      users.map(u => u._id === userId ? { ...u, active } : u)
    );
  }

  setPage(page: number): void {
    this.currentPage.set(page);
  }

  resetPagination(): void {
    this.currentPage.set(0);
  }

  clear(): void {
    this.users.set([]);
    this.loading.set(false);
    this.totalUsers.set(0);
    this.currentPage.set(0);
    this.totalPages.set(0);
  }
}
