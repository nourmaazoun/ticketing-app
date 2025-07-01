import { Routes } from '@angular/router';

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
    loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'ticket-form',
    loadComponent: () => import('./ticket-form/ticket-form').then(m => m.TicketForm)
  },
  {
    path: 'mytickets',
    loadComponent: () => import('./mytickets/mytickets').then(m => m.MyTicketsComponent)
  },
  {
  path: 'assigne-a-moi',
  loadComponent: () => import('./assigne-a-moi/assigne-a-moi').then(m => m.AssigneAMoiComponent)
},

  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
