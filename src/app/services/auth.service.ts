import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Comptes de démonstration avec validation
  private demoAccounts = [
    { 
      email: 'admin@anare-ci.org', 
      password: 'demo123',
      user: {
        id: '1',
        nom: 'Administrateur',
        prenom: 'Système',
        email: 'admin@anare-ci.org',
        telephone: '+225 07 12 34 56 78',
        role: UserRole.ADMIN,
        departement: 'Direction Générale',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
      }
    },
    { 
      email: 'superviseur.recours@anare-ci.org', 
      password: 'demo123',
      user: {
        id: '2',
        nom: 'Konaté',
        prenom: 'Aminata',
        email: 'superviseur.recours@anare-ci.org',
        telephone: '+225 07 12 34 56 79',
        role: UserRole.SUPERVISEUR_RECOURS,
        departement: 'Service Recours',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
      }
    },
    { 
      email: 'superviseur.it@anare-ci.org', 
      password: 'demo123',
      user: {
        id: '3',
        nom: 'Traoré',
        prenom: 'Ibrahim',
        email: 'superviseur.it@anare-ci.org',
        telephone: '+225 07 12 34 56 80',
        role: UserRole.SUPERVISEUR_IT,
        departement: 'Service IT',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
      }
    },
    { 
      email: 'utilisateur@anare-ci.org', 
      password: 'demo123',
      user: {
        id: '4',
        nom: 'Ouattara',
        prenom: 'Fatou',
        email: 'utilisateur@anare-ci.org',
        telephone: '+225 07 12 34 56 81',
        role: UserRole.UTILISATEUR,
        departement: 'Client',
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date()
      }
    }
  ];  constructor() {
    // Pas d'utilisateur connecté par défaut
  }

  login(email: string, password: string): Observable<User> {
    console.log('Tentative de connexion avec:', email, password);
    
    // Chercher le compte correspondant
    const account = this.demoAccounts.find(acc => 
      acc.email === email && acc.password === password
    );
    
    if (account) {
      console.log('Compte trouvé:', account.user);
      account.user.lastLogin = new Date();
      this.currentUserSubject.next(account.user);
      return of(account.user);
    } else {
      console.log('Identifiants incorrects');
      return throwError(() => new Error('Identifiants incorrects'));
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  // Méthode pour obtenir la liste des comptes démo (pour l'affichage)
  getDemoAccounts() {
    return [
      { email: 'admin@anare-ci.org', password: 'demo123', role: 'Administrateur', description: 'Accès complet au système' },
      { email: 'marie.dupont@anare-ci.org', password: 'demo123', role: 'Agent Recours', description: 'Gestion des recours clients' },
      { email: 'jean.kouame@anare-ci.org', password: 'demo123', role: 'Technicien IT', description: 'Support technique et tickets' },
      { email: 'awa.yao@anare-ci.org', password: 'demo123', role: 'Superviseur Recours', description: 'Supervision équipe recours' },
      { email: 'moussa.traore@anare-ci.org', password: 'demo123', role: 'Superviseur IT', description: 'Supervision équipe IT' }
    ];
  }
}
