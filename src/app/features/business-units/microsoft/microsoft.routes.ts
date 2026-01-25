import { Routes } from '@angular/router';

export const MicrosoftRoutes: Routes = [
  {
    path: '',
    children: [
    //   {
    //     path: ':tool',
    //     loadComponent: () => import('./tool/tool').then(m => m.MicrosoftTool)
    //   },
    //   {
    //     path: '',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    //   }
    ]
  }
];
