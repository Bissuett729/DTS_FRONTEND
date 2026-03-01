import { Routes } from '@angular/router';

export const DepartmentRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./departments').then(m => m.Departments)
    }
];
