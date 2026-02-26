import { Routes } from '@angular/router';

export const DownTimeRegisterRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./downtime-register').then(m => m.DowntimeRegister)
    }
];
