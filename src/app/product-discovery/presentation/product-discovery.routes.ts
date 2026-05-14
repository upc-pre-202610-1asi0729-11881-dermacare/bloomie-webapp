import { Routes } from '@angular/router';

const trendingItems = () =>
  import('./views/trending-items/trending-items').then((m) => m.TrendingItems);
const productDetail = () =>
  import('./views/product-detail/product-detail').then((m) => m.ProductDetail);

/**
 * Route tree for product discovery views — under /trending.
 */
export const productDiscoveryRoutes: Routes = [
  { path: '', loadComponent: trendingItems },
  { path: 'detail', loadComponent: productDetail },
];
