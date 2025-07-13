import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/guard-guard'; // 👈 à importer

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ticket-form',
    loadComponent: () => import('./ticket-form/ticket-form').then(m => m.TicketFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'mytickets',
    loadComponent: () => import('./mytickets/mytickets').then(m => m.KanbanBoardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'assigne-a-moi',
    loadComponent: () => import('./assigne-a-moi/assigne-a-moi').then(m => m.AssigneAMoiComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'not-found',
    loadComponent: () => import('./not-found/not-found').then(m => m.NotFoundComponent)
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'not-found' // 👈 redirige tout chemin inconnu vers Page Not Found
  }
];
