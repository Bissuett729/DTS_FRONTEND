import { Routes } from '@angular/router';
import { noAuthGuard, authGuard } from '../../core/infrastructure';

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
                path: 'register',
                canActivate: [noAuthGuard],
                loadComponent: () => import('./register/register').then(m => m.Register)
            },
            {
                path: 'change-password',
                canActivate: [authGuard],
                loadComponent: () => import('./change-password/change-password').then(m => m.ChangePassword)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    }
];
