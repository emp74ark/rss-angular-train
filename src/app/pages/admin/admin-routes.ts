import { Routes } from '@angular/router';

export const AdminRoutes: Routes = [
  {
    path: '',
    title: 'Admin Page',
    loadComponent: () => import('./admin.component').then(c => c.AdminComponent),
    children: [
      {
        path: 'routes',
        loadComponent: () => import('../admin-routes/admin-routes.component').then(c => c.AdminRoutesComponent),
      },
      {
        path: 'stations',
        loadComponent: () => import('../admin-stations/admin-stations.component').then(c => c.AdminStationsComponent),
      },
      {
        path: 'carriages',
        loadComponent: () =>
          import('../admin-carriages/admin-carriages.component').then(c => c.AdminCarriagesComponent),
      },
    ],
  },
];
