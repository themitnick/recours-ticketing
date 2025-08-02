import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecoursListComponent } from './components/recours/recours-list/recours-list.component';
import { RecoursDetailComponent } from './components/recours/recours-detail/recours-detail.component';
import { RecoursCreateComponent } from './components/recours/recours-create/recours-create.component';
import { TicketListComponent } from './components/tickets/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './components/tickets/ticket-detail/ticket-detail.component';
import { TicketCreateComponent } from './components/tickets/ticket-create/ticket-create.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { 
    path: 'recours', 
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RecoursListComponent },
      { path: 'nouveau', component: RecoursCreateComponent },
      { path: ':id', component: RecoursDetailComponent },
      { path: ':id/traitement', loadComponent: () => import('./components/traitement/traitement.component').then(m => m.TraitementComponent) }
    ]
  },
  { 
    path: 'tickets', 
    canActivate: [AuthGuard],
    children: [
      { path: '', component: TicketListComponent },
      { path: 'nouveau', component: TicketCreateComponent },
      { path: ':id', component: TicketDetailComponent },
      { path: ':id/traitement', loadComponent: () => import('./components/traitement/traitement.component').then(m => m.TraitementComponent) }
    ]
  },
  // Routes directes pour le traitement (pour tests)
  { 
    path: 'traitement/recours/:id', 
    loadComponent: () => import('./components/traitement/traitement.component').then(m => m.TraitementComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'traitement/tickets/:id', 
    loadComponent: () => import('./components/traitement/traitement.component').then(m => m.TraitementComponent),
    canActivate: [AuthGuard]
  },
  { path: 'rapports', loadComponent: () => import('./components/rapports/rapports.component').then(m => m.RapportsComponent), canActivate: [AuthGuard] },
  { path: 'admin', loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];
