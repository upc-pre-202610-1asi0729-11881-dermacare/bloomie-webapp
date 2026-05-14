import { Routes } from '@angular/router';

/** Lazy-load the dashboard home view. */
const dashboardHome = () =>
  import('./views/dashboard-home/dashboard-home').then((module) => module.DashboardHome);

/**
 * Route tree for the dashboard feature — under /dashboard.
 * The dashboard is a presentation-only aggregator that consumes
 * data from the skin-analysis, routine-management, and
 * dermatology-care bounded contexts via their shared stores.
 */
export const dashboardRoutes: Routes = [{ path: '', loadComponent: dashboardHome }];
