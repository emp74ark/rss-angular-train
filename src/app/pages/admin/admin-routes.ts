import { Routes } from '@angular/router';

export const AdminRoutes: Routes = [
  {
    path: '',
    title: 'Admin Page',
    loadComponent: () => import('./admin.component').then(c => c.AdminComponent),
    children: [
      {
        path: 'routes',
        pathMatch: 'full',
        loadComponent: () => import('../admin-routes/admin-routes.component').then(c => c.AdminRoutesComponent),
      },
      {
        path: 'stations',
        pathMatch: 'full',
        loadComponent: () => import('../admin-stations/admin-stations.component').then(c => c.AdminStationsComponent),
      },
      {
        path: 'carriages',
        pathMatch: 'full',
        loadComponent: () =>
          import('../admin-carriages/admin-carriages.component').then(c => c.AdminCarriagesComponent),
      },
      {
        path: 'routes/:routeId',
        pathMatch: 'full',
        loadComponent: () =>
          import('../admin-routes-ride/admin-routes-ride.component').then(c => c.AdminRoutesRideComponent),
      },
    ],
  },
];
