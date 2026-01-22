import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageRepository } from '../../domain/repositories/storage.repository';

export const noAuthGuard: CanActivateFn = (route, state) => {
    const storageRepository = inject(StorageRepository);
    const router = inject(Router);

    const token = storageRepository.getItem('accessToken');

    if (!token) { return true }

    router.navigate(['/dashboard']);
    return false;
};
