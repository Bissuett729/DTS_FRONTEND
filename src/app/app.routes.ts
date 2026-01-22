import { Routes } from '@angular/router';
import { authGuard } from './core/infrastructure/guards/auth.guard';
import { noAuthGuard } from './core/infrastructure/guards/no-auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [noAuthGuard],
        loadComponent: () => import('./features/auth/auth').then(m => m.Auth),
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
