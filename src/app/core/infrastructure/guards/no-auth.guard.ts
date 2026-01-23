import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../application/services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si el usuario ya está autenticado, redirigir a /foxcode
    if (authService.isUserAuthenticated()) {
        router.navigate(['/foxcode']);
        return false;
    }

    return true;
};
