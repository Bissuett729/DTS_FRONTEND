import { Routes } from '@angular/router';

export const TrendsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./trends').then(m => m.Trends)
    },
];
