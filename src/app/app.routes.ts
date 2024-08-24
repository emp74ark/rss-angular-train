import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'profile',
        title: 'Profile',
        loadComponent : () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
        // TODO: Add guards
    },
];
