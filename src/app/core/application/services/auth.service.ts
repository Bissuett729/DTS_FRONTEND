import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, of, Observable } from 'rxjs';
import { StorageRepository } from '../../domain/repositories/storage.repository';
import { LoginUseCase } from '../use-cases/auth/login.use-case';
import { LogoutUseCase } from '../use-cases/auth/logout.use-case';
import { GetCurrentUserUseCase } from '../use-cases/auth/get-current-user.use-case';
import { RefreshTokenUseCase } from '../use-cases/auth/refresh-token.use-case';
import { ILoginCredentials } from '../../domain/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUseCase = inject(LoginUseCase);
  private logoutUseCase = inject(LogoutUseCase);
  private getCurrentUserUseCase = inject(GetCurrentUserUseCase);
  private refreshTokenUseCase = inject(RefreshTokenUseCase);
  private storageRepository = inject(StorageRepository);
  private router = inject(Router);

  // State management con signals
  private userSignal = signal<any | null>(null);
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Token monitoring
  private tokenExpirationTimer: any = null;
  private readonly TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutos antes de expirar

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
    const token = this.storageRepository.getItem('accessToken');
    
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        
        // Verificar si el token no ha expirado
        if (this.isTokenValid(token)) {
          this.userSignal.set(user);
          this.startTokenMonitoring(token);
        } else {
          // Token expirado, limpiar storage
          this.clearAuthData();
        }
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        this.clearAuthData();
      }
    }
  }

  private clearAuthData(): void {
    this.storageRepository.removeItem('user');
    this.storageRepository.removeItem('accessToken');
    this.userSignal.set(null);
    this.stopTokenMonitoring();
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  private startTokenMonitoring(token: string): void {
    this.stopTokenMonitoring();
    
    try {
      const payload = this.decodeToken(token);
      const expirationTime = payload.exp * 1000; // Convertir a milisegundos
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;
      const timeUntilRefresh = timeUntilExpiration - this.TOKEN_REFRESH_BUFFER;

      if (timeUntilRefresh > 0) {
        // Programar refresh del token antes de que expire
        this.tokenExpirationTimer = setTimeout(() => {
          console.log('Token about to expire, refreshing...');
          this.refreshToken();
        }, timeUntilRefresh);
      } else if (timeUntilExpiration > 0) {
        // Token está cerca de expirar, refresh inmediatamente
        console.log('Token expiring soon, refreshing now...');
        this.refreshToken();
      } else {
        // Token ya expiró
        console.log('Token expired, logging out...');
        this.logout();
      }
    } catch (error) {
      console.error('Error starting token monitoring:', error);
      this.logout();
    }
  }

  private stopTokenMonitoring(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  isUserAuthenticated(): boolean {
    const token = this.storageRepository.getItem('accessToken');
    if (!token) {
      return false;
    }
    return this.isTokenValid(token);
  }

  login(credentials: ILoginCredentials): void {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    this.loginUseCase
      .execute(credentials)
      .pipe(
        tap((response) => {
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
            authorized: response.user.authorized,
          });
          this.isLoadingSignal.set(false);

          // Iniciar monitoreo del token
          this.startTokenMonitoring(response.accessToken);

          // Redireccionar según si requiere cambio de contraseña
          if (response.user.requiresPasswordChange) {
            this.router.navigate(['/auth/change-password']);
          } else {
            this.router.navigate(['/foxcode']);
          }
        }),
        catchError((error) => {
          this.errorSignal.set(error.message);
          this.isLoadingSignal.set(false);
          return of();
        }),
      )
      .subscribe();
  }

  logout(): void {
    this.stopTokenMonitoring();
    this.logoutUseCase
      .execute()
      .pipe(
        tap((response) => {
          // Solo limpiar y redirigir si el logout fue exitoso
          if (response.success) {
            console.log('Logout successful:', response.message);
            this.clearAuthData();
            this.router.navigate(['/auth/login']);
          } else {
            console.warn('Logout was not successful:', response);
            // Aún así limpiar los datos locales por seguridad
            this.clearAuthData();
            this.router.navigate(['/auth/login']);
          }
        }),
        catchError((error) => {
          console.error('Error during logout:', error);
          // Limpiar datos locales incluso si hay error
          this.clearAuthData();
          this.router.navigate(['/auth/login']);
          return of();
        }),
      )
      .subscribe();
  }

  refreshUserData(): void {
    this.getCurrentUserUseCase
      .execute()
      .pipe(
        tap((user) => this.userSignal.set(user)),
        catchError((error) => {
          console.error('Error refreshing user data:', error);
          return of();
        }),
      )
      .subscribe();
  }

  refreshToken(): void {
    const currentToken = this.storageRepository.getItem('accessToken');
    if (!currentToken) {
      console.error('No access token available to refresh');
      this.logout();
      return;
    }

    this.refreshTokenUseCase
      .execute(currentToken)
      .pipe(
        tap((response) => {
          // Actualizar el usuario con los nuevos datos
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
            authorized: response.user.authorized,
          });
          
          // Reiniciar monitoreo del token con el nuevo token
          this.startTokenMonitoring(response.accessToken);
          
          console.log('Token refreshed successfully');
        }),
        catchError((error) => {
          console.error('Error refreshing token:', error);
          // Si el refresh falla, cerrar sesión
          this.logout();
          return of();
        }),
      )
      .subscribe();
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
