import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

export const routes: Routes = [
    { path: '**', component: NotFoundPageComponent },
    {
        path: 'profile',
        title: 'Profile',
        loadComponent : () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent)
        // TODO: Add guards
    },
];
