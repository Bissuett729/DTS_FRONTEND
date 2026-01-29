import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, GlobalStateService } from '../../application';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const globalState = inject(GlobalStateService);
  const router = inject(Router);

  // Si el usuario está autenticado
  if (authService.isUserAuthenticated()) {
    // Get user from global state
    const user = globalState.currentUser();

    // Si no está autorizado, permitir acceso al login/register
    if (!user?.authorized) {
      return true;
    }

    // Si requiere cambio de contraseña, redirigir a change-password
    if (user?.requiresPasswordChange) {
      router.navigate(['/auth/change-password']);
      return false;
    }

    // Si está autorizado y no requiere cambio de contraseña, redirigir a foxcode
    router.navigate(['/foxcode']);
    return false;
  }

  return true;
};
