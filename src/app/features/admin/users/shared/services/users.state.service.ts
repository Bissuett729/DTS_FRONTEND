import { Injectable, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GetUsersUseCase } from '../../../../../core/application/use-cases/users';
import { IUser, IUserFilters } from '../../../../../core/domain/interfaces/user.interface';

@Injectable()
export class UsersStateService {
  users = signal<IUser[]>([]);
  loading = signal<boolean>(false);
  totalUsers = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  totalPages = signal<number>(0);

  constructor(private getUsersUseCase: GetUsersUseCase) {}

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
    this.users.update(users => [user, ...users]);
    this.totalUsers.update(total => total + 1);
  }

  updateUser(updatedUser: IUser): void {
    this.users.update(users =>
      users.map(u => u._id === updatedUser._id ? updatedUser : u)
    );
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
    this.currentPage.set(1);
    this.totalPages.set(0);
  }
}
