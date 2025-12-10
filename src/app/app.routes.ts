import { Routes } from '@angular/router';
import { Navigation } from '@features/navigation/navigation';

export const routes: Routes = [
    {
        path: '',
        component: Navigation,
        children: [
            { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('@features/dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: 'league',
                loadComponent: () =>
                    import('@features/box-league/box-league').then((m) => m.BoxLeague),
            },
            {
                path: 'leaderboard',
                loadComponent: () =>
                    import('@features/leaderboard/leaderboard').then((m) => m.Leaderboard),
            },
            {
                path: 'account',
                loadComponent: () => import('@features/account/account').then((m) => m.Account),
            },
            {
                path: 'admin',
                loadComponent: () => import('@features/admin/admin').then((m) => m.Admin),
            },
            {
                path: 'matches',
                loadComponent: () =>
                    import('@features/match-history/match-history').then((m) => m.MatchHistory),
            },
        ],
    },
    {
        path: 'login',
        loadComponent: () => import('@features/login-flow/login-flow').then((m) => m.LoginFlow),
    },
];
