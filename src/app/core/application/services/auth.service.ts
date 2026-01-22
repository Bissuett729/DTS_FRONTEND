import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, of } from 'rxjs';
import { StorageRepository } from '../../domain/repositories/storage.repository';
import { LoginUseCase } from '../use-cases/auth/login.use-case';
import { LogoutUseCase } from '../use-cases/auth/logout.use-case';
import { GetCurrentUserUseCase } from '../use-cases/auth/get-current-user.use-case';
import { ILoginCredentials } from '../../domain/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUseCase = inject(LoginUseCase);
  private logoutUseCase = inject(LogoutUseCase);
  private getCurrentUserUseCase = inject(GetCurrentUserUseCase);
  private storageRepository = inject(StorageRepository);
  private router = inject(Router);

  // State management con signals
  private userSignal = signal<any | null>(null);
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  readonly user = this.userSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const userStr = this.storageRepository.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userSignal.set(user);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        this.storageRepository.removeItem('user');
      }
    }
  }

  login(credentials: ILoginCredentials): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.loginUseCase.execute(credentials).pipe(
      tap(response => {
        this.userSignal.set({
          id: response.user._id,
          email: response.user.email,
          username: response.user.username,
          clock: response.user.clock,
          roleIds: response.user.roleIds,
          departmentId: response.user.departmentId,
          businessUnitId: response.user.businessUnitId,
          active: response.user.active,
          requiresPasswordChange: response.user.requiresPasswordChange,
          authorized: response.user.authorized
        });
        this.isLoadingSignal.set(false);
        
        // Redireccionar según si requiere cambio de contraseña
        if (response.user.requiresPasswordChange) {
          this.router.navigate(['/auth/change-password']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError(error => {
        this.errorSignal.set(error.message);
        this.isLoadingSignal.set(false);
        return of();
      })
    ).subscribe();
  }

  logout(): void {
    this.logoutUseCase.execute().pipe(
      tap(() => {
        this.userSignal.set(null);
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => {
        console.error('Error during logout:', error);
        this.userSignal.set(null);
        this.router.navigate(['/auth/login']);
        return of();
      })
    ).subscribe();
  }

  refreshUserData(): void {
    this.getCurrentUserUseCase.execute().pipe(
      tap(user => this.userSignal.set(user)),
      catchError(error => {
        console.error('Error refreshing user data:', error);
        return of();
      })
    ).subscribe();
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
