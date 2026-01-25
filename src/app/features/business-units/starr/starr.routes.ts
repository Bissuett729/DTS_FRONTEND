import { Routes } from '@angular/router';

export const StarrRoutes: Routes = [
  {
    path: '',
    children: [
    //   {
    //     path: ':tool',
    //     loadComponent: () => import('./tool/tool').then(m => m.StarrTool)
    //   },
    //   {
    //     path: '',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    //   }
    ]
  }
];
