import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Page de connexion avec comptes démo -->
    <div class="login-container">
      <div class="login-card animate-scale-in">
        <div class="login-header">
          <div class="login-logo">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h1 class="login-title">ANARE-CI</h1>
          <p class="login-subtitle">Système de gestion des recours et ticketing</p>
        </div>
        
        <!-- Formulaire de connexion -->
        <form class="space-y-6" (ngSubmit)="login()">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" 
                   [(ngModel)]="loginForm.email" 
                   name="email"
                   class="form-input" 
                   placeholder="votre@email.com"
                   required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input type="password" 
                   [(ngModel)]="loginForm.password" 
                   name="password"
                   class="form-input" 
                   placeholder="••••••••"
                   required>
          </div>
          
          @if (errorMessage) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>
          }
          
          <button type="submit" class="btn btn-primary w-full btn-lg" [disabled]="isLoading">
            @if (isLoading) {
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion...
            } @else {
              Se connecter
            }
          </button>
        </form>
        
        <!-- Section comptes démo -->
        <div class="mt-8 border-t border-gray-200 pt-8">
          <h3 class="text-sm font-semibold text-gray-900 mb-4 text-center">Comptes de démonstration</h3>
          <div class="space-y-3">
            @for (account of demoAccounts; track account.email) {
              <div class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                   (click)="quickLogin(account)">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-sm font-semibold text-gray-900">{{ account.role }}</span>
                      <span class="badge badge-info">{{ account.email }}</span>
                    </div>
                    <p class="text-xs text-gray-600">{{ account.description }}</p>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            }
          </div>
          <p class="text-xs text-gray-500 text-center mt-4">
            Cliquez sur un compte pour vous connecter directement
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-scale-in {
      animation: scaleIn 0.3s ease-out;
    }
    
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class LoginComponent {
  loginForm = {
    email: '',
    password: ''
  };
  
  errorMessage = '';
  isLoading = false;
  returnUrl = '/dashboard';
  
  // Comptes démo
  demoAccounts = [
    { email: 'admin@anare-ci.org', password: 'demo123', role: 'Administrateur', description: 'Accès complet au système' },
    { email: 'superviseur.recours@anare-ci.org', password: 'demo123', role: 'Superviseur Recours', description: 'Supervision équipe recours et gestion avancée' },
    { email: 'superviseur.it@anare-ci.org', password: 'demo123', role: 'Superviseur IT', description: 'Supervision équipe IT et support technique' },
    { email: 'utilisateur@anare-ci.org', password: 'demo123', role: 'Utilisateur', description: 'Création recours/tickets et suivi des demandes' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Récupérer l'URL de retour si elle existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  login(): void {
    if (this.isLoading) return;
    
    this.errorMessage = '';
    this.isLoading = true;
    
    console.log('Tentative de connexion avec:', this.loginForm.email, this.loginForm.password);
    
    this.authService.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: (user: User) => {
        console.log('Connexion réussie:', user);
        this.isLoading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: (error: any) => {
        console.error('Erreur de connexion:', error);
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  quickLogin(account: any): void {
    console.log('Connexion rapide avec:', account);
    
    // Remplir automatiquement les champs avec les informations du compte démo
    this.loginForm.email = account.email;
    this.loginForm.password = 'demo123';
    
    // Connecter automatiquement après un petit délai pour montrer le remplissage
    setTimeout(() => {
      this.login();
    }, 500);
  }
}
