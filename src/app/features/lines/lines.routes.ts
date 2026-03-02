import { Routes } from '@angular/router';

export const AdminLinesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./lines').then(m => m.AdminLines)
    },
];
