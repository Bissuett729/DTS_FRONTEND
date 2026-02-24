import { Routes } from '@angular/router';
import { Home } from './home';

export const HomeRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'   
    },
    {
        path: 'home',
        component: Home,
    }
];
