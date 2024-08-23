import { Routes } from '@angular/router';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { SigninPageComponent } from './pages/signin-page/signin-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'signin', component: SigninPageComponent, canMatch: [authGuard] },
  { path: 'signup', component: SignupPageComponent, canMatch: [authGuard] },
  { path: '**', component: NotFoundPageComponent },
];
