import { Routes } from '@angular/router';

export const AdminLinesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./admin-lines').then(m => m.AdminLines)
    },
];
