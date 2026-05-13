import { Routes } from '@angular/router';

const signInHome = () =>
  import('./views/sign-in-home/sign-in-home.component').then(
    (module) => module.SignInHomeComponent,
  );

const signIn = () =>
  import('./views/sign-in/sign-in.component').then((module) => module.SignInComponent);

export const iamRoutes: Routes = [
  { path: 'sign-in-home', loadComponent: signInHome },
  { path: 'sign-in', loadComponent: signIn },
  { path: '', redirectTo: 'sign-in-home', pathMatch: 'full' },
];
