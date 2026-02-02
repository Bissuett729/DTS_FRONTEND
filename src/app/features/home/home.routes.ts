import { Routes } from '@angular/router';
import { Home } from './home';
import { SupportReportView } from './features/support-report/support-report-view/support-report-view';

export const HomeRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'   
    },
    {
        path: 'home',
        component: Home,
    },
    {
        path: 'support-report/:code',
        component: SupportReportView,
    }
];
