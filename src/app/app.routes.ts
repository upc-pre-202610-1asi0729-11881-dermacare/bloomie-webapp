import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // Routes will be added here as each bounded context is implemented
  { path: '**', redirectTo: 'home' },
];
