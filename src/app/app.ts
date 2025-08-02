import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { User, UserRole } from './models';
import { filter } from 'rxjs/operators';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FormsModule, ToastContainerComponent, ModalContainerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  currentUser: User | null = null;
  isSidebarCollapsed = false;
  mobileMenuOpen = false;
  UserRole = UserRole;

  menuItems = [
    {
      label: 'Tableau de bord',
      icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586l-1 1V5H4v14h16v-2.586l1 1V20a1 1 0 01-1 1H4a1 1 0 01-1-1V4z',
      route: '/dashboard',
      roles: [UserRole.ADMIN, UserRole.SUPERVISEUR_RECOURS, UserRole.SUPERVISEUR_IT, UserRole.UTILISATEUR]
    },
    {
      label: 'Recours',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      route: '/recours',
      roles: [UserRole.ADMIN, UserRole.SUPERVISEUR_RECOURS, UserRole.UTILISATEUR]
    },
    {
      label: 'Tickets IT',
      icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      route: '/tickets',
      roles: [UserRole.ADMIN, UserRole.SUPERVISEUR_IT, UserRole.UTILISATEUR]
    },
    {
      label: 'Rapports',
      icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      route: '/rapports',
      roles: [UserRole.ADMIN, UserRole.SUPERVISEUR_RECOURS, UserRole.SUPERVISEUR_IT]
    },
    {
      label: 'Administration',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      route: '/admin',
      roles: [UserRole.ADMIN]
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getInitials(user: User): string {
    return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();
  }

  getRoleLabel(role: UserRole): string {
    const labels = {
      [UserRole.ADMIN]: 'Administrateur',
      [UserRole.AGENT_RECOURS]: 'Agent Recours',
      [UserRole.TECHNICIEN_IT]: 'Technicien IT',
      [UserRole.SUPERVISEUR_RECOURS]: 'Superviseur Recours',
      [UserRole.SUPERVISEUR_IT]: 'Superviseur IT',
      [UserRole.UTILISATEUR]: 'Utilisateur'
    };
    return labels[role] || role;
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role as UserRole);
  }

  hasAccess(roles: UserRole[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.prenom} ${this.currentUser.nom}`;
    }
    return '';
  }

  getRoleDisplayName(): string {
    if (!this.currentUser) return '';
    
    const roleNames: { [key in UserRole]: string } = {
      [UserRole.ADMIN]: 'Administrateur',
      [UserRole.AGENT_RECOURS]: 'Agent Recours',
      [UserRole.SUPERVISEUR_RECOURS]: 'Superviseur Recours',
      [UserRole.TECHNICIEN_IT]: 'Technicien IT',
      [UserRole.SUPERVISEUR_IT]: 'Superviseur IT',
      [UserRole.UTILISATEUR]: 'Utilisateur'
    };
    
    return roleNames[this.currentUser.role] || this.currentUser.role;
  }
}
