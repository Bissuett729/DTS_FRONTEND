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
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AuthRoutes)
    },
    {
        path: 'foxcode',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/layouts/layout-template/layout-template').then(m => m.LayoutTemplate),
        children: [
            {
                path: '',
                loadChildren: () => import('./features/home/home.routes').then(m => m.HomeRoutes)
            },
            {
                path: 'microsoft',
                loadChildren: () => import('./features/business-units/microsoft/microsoft.routes').then(m => m.MicrosoftRoutes)
            },
            {
                path: 'lvo',
                loadChildren: () => import('./features/business-units/lvo/lvo.routes').then(m => m.LvoRoutes)
            },
            {
                path: 'starr',
                loadChildren: () => import('./features/business-units/starr/starr.routes').then(m => m.StarrRoutes)
            },
            {
                path: 'development/admin',
                loadChildren: () => import('./features/admin/admin.routes').then(m => m.AdminRoutes)
            },
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/foxcode'
    }
];
