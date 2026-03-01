import { Routes } from '@angular/router';

export const ShiftsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./shifts').then(m => m.Shifts)
    }
];
