import { Routes } from '@angular/router';
import { authGuard } from './core/infrastructure/guards/auth.guard';
import { rootRedirectGuard } from './core/infrastructure/guards/root-redirect.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [rootRedirectGuard],
        children: []
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AuthRoutes)
    },
    {
        path: 'dts',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/layouts/layout-template/layout-template').then(m => m.LayoutTemplate),
        children: [
            {
                path: 'home',
                loadChildren: () => import('./features/home/home.routes').then(m => m.HomeRoutes)
            },
            {
                path: 'users',
                loadChildren: () => import('./features/users/users.routes').then(m => m.UsersRoutes)
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/dts'
    }
];
