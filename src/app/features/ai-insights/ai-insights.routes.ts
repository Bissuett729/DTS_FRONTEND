import { Routes } from '@angular/router';

export const AiInsightsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./ai-insights').then(m => m.AiInsights)
    },
];
