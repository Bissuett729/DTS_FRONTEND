import { Routes } from '@angular/router';

export const AdminLinesRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard-lines.component').then(m => m.DashboardLines)
    },
    {
        path: 'create',
        loadComponent: () => import('./create-line/create-line.component').then(m => m.CreateLineComponent)
    },
    {
        path: 'update',
        loadComponent: () => import('./update-line/update-line.component').then(m => m.UpdateLineComponent)
    }
];
