import { Routes } from '@angular/router';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { SigninPageComponent } from './pages/signin-page/signin-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { TripPageComponent } from './pages/trip-page/trip-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'profile',
    title: 'Profile',
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent),
    canMatch: [authGuard],
  },
  { path: 'search', component: SearchPageComponent, pathMatch: 'full' },
  { path: 'trip/:id', component: TripPageComponent },
  {
    path: 'signin',
    component: SigninPageComponent,
    canMatch: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'signup',
    component: SignupPageComponent,
    canMatch: [authGuard],
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin-routes').then(routes => routes.AdminRoutes),
    canMatch: [adminGuard],
  },
  { path: '**', component: NotFoundPageComponent },
];
