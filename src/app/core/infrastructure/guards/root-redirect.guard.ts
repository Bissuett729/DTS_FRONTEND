import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../application/services/auth.service';

export const rootRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Si el usuario está autenticado, redirigir a /foxcode
  if (authService.isUserAuthenticated()) {
    router.navigate(['/foxcode']);
  } else {
    // Si no está autenticado, redirigir a /auth/login
    router.navigate(['/auth/login']);
  }
  
  return false; // Siempre retorna false porque ya hicimos la redirección
};
