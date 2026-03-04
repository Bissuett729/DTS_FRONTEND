import { Routes } from '@angular/router';

export const ProfileRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./profile').then(m => m.Profile)
    },
];
