import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, of, Observable } from 'rxjs';
import { LoginUseCase } from '../use-cases/auth/login.use-case';
import { LogoutUseCase } from '../use-cases/auth/logout.use-case';
import { GetCurrentUserUseCase } from '../use-cases/auth/get-current-user.use-case';
import { RefreshTokenUseCase } from '../use-cases/auth/refresh-token.use-case';
import { ILoginCredentials } from '../../domain/interfaces';
import { StorageUseCase } from '../use-cases';
import { GlobalStateService } from './global-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUseCase = inject(LoginUseCase);
  private logoutUseCase = inject(LogoutUseCase);
  private getCurrentUserUseCase = inject(GetCurrentUserUseCase);
  private refreshTokenUseCase = inject(RefreshTokenUseCase);
  private storageRepository = inject(StorageUseCase);
  private router = inject(Router);
  private globalState = inject(GlobalStateService);

  // Token monitoring
  private tokenExpirationTimer: any = null;
  private readonly TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutos antes de expirar

  // Expose global state signals for backward compatibility
  readonly user = this.globalState.currentUser;
  readonly isLoading = this.globalState.authLoading;
  readonly error = this.globalState.authError;
  readonly isAuthenticated = this.globalState.isAuthenticated;

  // For backward compatibility
  userSignal = this.globalState.currentUser;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.storageRepository.getItem('accessToken');

    if (token) {
      // Verificar si el token no ha expirado
      if (this.isTokenValid(token)) {
        this.startTokenMonitoring(token);
      } else {
        // Token expirado, limpiar storage
        this.clearAuthData();
      }
    }
  }

  private clearAuthData(): void {
    this.globalState.clearAuthState();
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
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  private startTokenMonitoring(token: string): void {
    this.stopTokenMonitoring();
    const currentToken = this.storageRepository.getItem('accessToken');

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
        this.logout(currentToken!);
      }
    } catch (error) {
      console.error('Error starting token monitoring:', error);
      this.logout(currentToken!);
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
    this.globalState.setAuthLoading(true);
    this.globalState.clearAuthError();

    this.loginUseCase
      .execute(credentials)
      .pipe(
        tap((response) => {
          // Update global state (cast to any to handle API response type differences)
          this.globalState.setUser(response.user as any);
          this.globalState.setAccessToken(response.accessToken);
          this.globalState.setAuthenticated(true);
          this.globalState.setAuthLoading(false);

          // Iniciar monitoreo del token
          this.startTokenMonitoring(response.accessToken);

          // Redireccionar según si requiere cambio de contraseña
          if (response.user.requiresPasswordChange) {
            this.globalState.setAllowChangePassword(true);
            this.router.navigate(['/auth/change-password']);
          } else {
            this.globalState.setAllowChangePassword(false);
            this.globalState.setLoadingPage(true);
            this.router.navigate(['/foxcode']);
          }
        }),
        catchError((error) => {
          this.globalState.setAuthError(error.message);
          this.globalState.setAuthLoading(false);
          return of();
        }),
      )
      .subscribe();
  }

  logout(token: string): void {
    this.stopTokenMonitoring();
    this.logoutUseCase
      .execute(token)
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
    const userId = this.globalState.currentUser()?._id;

    if (!userId) {
      console.warn('[AuthService] Cannot refresh user data: No user ID available');
      return;
    }

    this.getCurrentUserUseCase
      .execute(userId)
      .pipe(
        tap((user) => this.globalState.setUser(user)),
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
      this.logout(currentToken!);
      return;
    }

    this.refreshTokenUseCase
      .execute(currentToken)
      .pipe(
        tap((response) => {
          // Actualizar el usuario con los nuevos datos (cast to any for API response compatibility)
          this.globalState.setUser(response.user as any);
          this.globalState.setAccessToken(response.accessToken);

          // Reiniciar monitoreo del token con el nuevo token
          this.startTokenMonitoring(response.accessToken);

          console.log('Token refreshed successfully');
        }),
        catchError((error) => {
          console.error('Error refreshing token:', error);
          // Si el refresh falla, cerrar sesión
          this.logout(currentToken!);
          return of();
        }),
      )
      .subscribe();
  }

  clearError(): void {
    this.globalState.clearAuthError();
  }

  resetAuthState(): void {
    this.globalState.clearAuthError();
    this.globalState.setAuthLoading(false);
    this.globalState.setAllowChangePassword(false);
  }

  canAccessChangePassword(): boolean {
    return this.globalState.allowChangePassword();
  }

  markPasswordChanged(): void {
    this.globalState.setRequiresPasswordChange(false);
    this.globalState.setAllowChangePassword(false);
  }

  changePassword(id: string, currentPassword: string, newPassword: string): Observable<any> {
    return this.loginUseCase['authRepository'].changePassword(id, currentPassword, newPassword);
  }
}
