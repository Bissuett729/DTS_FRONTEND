import { Routes } from '@angular/router';
import { authGuard } from './core/infrastructure/guards/auth.guard';
import { noAuthGuard } from './core/infrastructure/guards/no-auth.guard';
import { rootRedirectGuard } from './core/infrastructure/guards/root-redirect.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [rootRedirectGuard],
        children: []
    },
    {
        path: 'auth',
        canActivate: [noAuthGuard],
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AuthRoutes)
    },
    {
        path: 'foxcode',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/layouts/layout-template/layout-template').then(m => m.LayoutTemplate)
    },
    {
        path: '**',
        redirectTo: '/foxcode'
    }
];
