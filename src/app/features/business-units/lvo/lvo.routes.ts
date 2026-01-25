import { Routes } from '@angular/router';

export const LvoRoutes: Routes = [
  {
    path: '',
    children: [
    //   {
    //     path: ':tool',
    //     loadComponent: () => import('./tool/tool').then(m => m.LvoTool)
    //   },
    //   {
    //     path: '',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    //   }
    ]
  }
];
