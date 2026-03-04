import { Routes } from '@angular/router';

export const ReportsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./reports').then(m => m.Reports)
    },
];
