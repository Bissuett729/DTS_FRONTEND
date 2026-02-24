import { Routes } from '@angular/router';
import { noAuthGuard } from '../../core/infrastructure';

export const AuthRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./auth').then(m => m.Auth),
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                canActivate: [noAuthGuard],
                loadComponent: () => import('./login/login').then(m => m.Login)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    }
];