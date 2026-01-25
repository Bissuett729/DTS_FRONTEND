import { Routes } from '@angular/router';

export const AdminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin').then(m => m.Admin),
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users').then(m => m.Users)
      },
      {
        path: 'tools',
        loadComponent: () => import('./tools/tools').then(m => m.Tools)
      },
      {
        path: 'departments',
        loadComponent: () => import('./departments/departments').then(m => m.Departments)
      },
      {
        path: 'business-units',
        loadComponent: () => import('./business-units/business-units').then(m => m.BusinessUnits)
      },
      {
        path: 'roles',
        loadComponent: () => import('./roles/roles').then(m => m.Roles)
      },
      {
        path: 'shifts',
        loadComponent: () => import('./shifts/shifts').then(m => m.Shifts)
      },
      {
        path: '*',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  }
];
