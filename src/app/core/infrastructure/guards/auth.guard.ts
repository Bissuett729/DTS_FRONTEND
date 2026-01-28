import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../application/services/auth.service';
import { StorageUseCase } from '../../application';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const storageRepository = inject(StorageUseCase);

  const currentToken = storageRepository.getItem('accessToken');

  // Verificar si el usuario está autenticado y el token es válido
  if (!authService.isUserAuthenticated()) {
    // Si no está autenticado, redirigir al login
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const user = authService.user();

  // PRIORIDAD 1: Verificar si el usuario requiere cambio de contraseña
  if (user?.requiresPasswordChange) {
    // Si requiere cambio de contraseña, solo permitir acceso si viene del login
    if (!authService.canAccessChangePassword()) {
      router.navigate(['/auth/login']);
      return false;
    }
    // Permitir solo acceso a change-password
    if (!state.url.includes('/auth/change-password')) {
      router.navigate(['/auth/change-password']);
      return false;
    }
    // Permitir acceso a change-password
    return true;
  }

  // PRIORIDAD 2: Verificar si el usuario está autorizado (solo después de cambiar contraseña)
  if (!user?.authorized) {
    // Usuario no autorizado, redirigir al login
    router.navigate(['/auth/login'], {
      queryParams: { message: 'Your account is not authorized. Please contact an administrator.' }
    });
    authService.logout(currentToken!);
    return false;
  }

  // Si el usuario NO requiere cambio de contraseña pero está intentando acceder a change-password
  if (!user?.requiresPasswordChange && state.url.includes('/auth/change-password')) {
    router.navigate(['/foxcode']);
    return false;
  }

  return true;
};
