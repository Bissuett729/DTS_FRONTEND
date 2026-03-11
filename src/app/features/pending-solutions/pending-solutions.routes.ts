import { Routes } from '@angular/router';

export const PendingSolutionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pending-solutions').then(m => m.PendingSolutions),
  },
];
