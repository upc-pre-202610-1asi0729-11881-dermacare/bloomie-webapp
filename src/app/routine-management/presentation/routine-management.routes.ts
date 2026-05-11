import { Routes } from '@angular/router';

const routineProductList = () =>
  import('./views/routine-product-list/routine-product-list').then((m) => m.RoutineProductList);
const productReplacement = () =>
  import('./views/product-replacement/product-replacement').then((m) => m.ProductReplacement);
const replaceConfirmation = () =>
  import('./views/replace-confirmation/replace-confirmation').then((m) => m.ReplaceConfirmation);

/**
 * Route tree for routine management presentation views — under /routine.
 */
export const routineManagementRoutes: Routes = [
  { path: '', loadComponent: routineProductList },
  { path: 'product-replacement', loadComponent: productReplacement },
  { path: 'replace-confirmation', loadComponent: replaceConfirmation },
];
