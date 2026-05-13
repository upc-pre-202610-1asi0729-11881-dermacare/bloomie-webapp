import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/presentation/dashboard.routes').then((module) => module.dashboardRoutes),
    redirectTo: 'iam',
    pathMatch: 'full',
  },
  {
    path: 'iam',
    loadChildren: () =>
      import('./iam/presentation/iam.routes').then((m) => m.iamRoutes),
  },
  {
    path: 'dermatology',
    loadChildren: () =>
      import('./dermatology-care/presentation/dermatology-care.routes').then(
        (module) => module.dermatologyCareRoutes,
      ),
  },
  {
    path: 'routine',
    loadChildren: () =>
      import('./routine-management/presentation/routine-management.routes').then(
        (module) => module.routineManagementRoutes,
      ),
  },
  {
    path: 'derm',
    loadChildren: () =>
      import('./dermatology-care/presentation/dermatology-care.routes').then(
        (module) => module.dermRoutes,
      ),
  },
  {
    path: 'consult',
    loadChildren: () =>
      import('./intelligent-support/presentation/intelligent-support.routes').then(
        (module) => module.intelligentSupportRoutes,
      ),
  },
  {
    path: 'trending',
    loadChildren: () =>
      import('./product-discovery/presentation/product-discovery.routes').then(
        (module) => module.productDiscoveryRoutes,
      ),
  },
  {
    path: 'skin-analysis',
    loadChildren: () =>
      import('./skin-analysis/presentation/skin-analysis.routes').then(
        (module) => module.skinAnalysisRoutes,
      ),
  },

  { path: '**', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'iam' },
];
