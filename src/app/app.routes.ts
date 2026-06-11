import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'tracks', pathMatch: 'full' },
 { path: 'tracks', loadComponent: () => import('./track-search/track-search').then((m) => m.TrackSearch) },
  { path: 'tracks/new', canActivate: [authGuard],
    loadComponent: () => import('./track-form/track-form').then((m) => m.TrackForm) },
  { path: 'tracks/:id', loadComponent: () => import('./services/track-detail').then((m) => m.TrackDetail) },
  { path: 'tracks/:id/edit', canActivate: [authGuard],
    loadComponent: () => import('./track-form/track-form').then((m) => m.TrackForm) },
  { path: 'favorites', canActivate: [authGuard],
    loadComponent: () => import('./favorites-page/favorites-page').then((m) => m.FavoritesPage) },
  { path: 'login', loadComponent: () => import('./auth-login/auth-login').then((m) => m.AuthLogin) },
];