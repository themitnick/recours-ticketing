import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecoursService } from '../../../services/recours.service';
import { AuthService } from '../../../services/auth.service';
import { Recours, StatutRecours, User, UserRole } from '../../../models';

@Component({
  selector: 'app-recours-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="recours-detail" *ngIf="recours">
      <!-- En-tête avec navigation -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <button (click)="goBack()" class="text-primary-600 hover:text-primary-700 mb-4 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Retour à la liste
          </button>
          <h1 class="text-2xl font-bold text-gray-900">📋 Recours {{ recours.numeroRecours }}</h1>
          <p class="text-gray-600 mt-1">Consultation du détail et traitement du recours</p>
        </div>
        
        <!-- Bouton Traitement (pour superviseurs) -->
        <div *ngIf="canProcessRecours()" class="flex space-x-3">
          <button 
            [routerLink]="['/recours', recours.id, 'traitement']" 
            class="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
            🔍 Traitement du recours
          </button>
        </div>
      </div>

      <!-- Résumé de la demande (toujours visible) -->
      <div class="card p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div class="flex items-center mb-4">
          <div class="p-2 bg-green-100 rounded-lg mr-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-green-900">📋 Résumé du Recours</h2>
            <p class="text-sm text-green-700">{{ recours.typeRecours }} • {{ recours.canalEntree }}</p>
          </div>
          <div class="ml-auto">
            <span class="px-3 py-1 text-sm font-medium rounded-full {{ getStatutColor(recours.statut) }}">
              {{ recours.statut }}
            </span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p class="text-green-600 font-medium">👤 Requérant</p>
            <p class="text-green-900">{{ recours.requrantPrenom }} {{ recours.requrantNom }}</p>
            <p class="text-green-700">{{ recours.requrantEmail }}</p>
          </div>
          <div>
            <p class="text-green-600 font-medium">📅 Dates importantes</p>
            <p class="text-green-900">Créé le {{ recours.dateCreation | date:'dd/MM/yyyy' }}</p>
            <p class="text-green-700">Échéance {{ recours.dateEcheance | date:'dd/MM/yyyy' }}</p>
          </div>
          <div>
            <p class="text-green-600 font-medium">💰 Montant litige</p>
            <p class="text-green-900 text-lg font-bold">{{ recours.montantLitige | number:'1.0-0' }} FCFA</p>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-green-200">
          <p class="text-green-600 font-medium mb-2">📝 Description</p>
          <p class="text-green-900">{{ recours.description }}</p>
        </div>
      </div>
      
      <!-- Détails complets -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Informations détaillées
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-600">Requérant</p>
            <p class="font-medium">{{ recours.requrantPrenom }} {{ recours.requrantNom }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Email</p>
            <p class="font-medium">{{ recours.requrantEmail }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Téléphone</p>
            <p class="font-medium">{{ recours.requrantTelephone }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Type de recours</p>
            <p class="font-medium">{{ recours.typeRecours }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Canal d'entrée</p>
            <p class="font-medium">{{ recours.canalEntree }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Statut</p>
            <span class="px-2 py-1 text-xs font-medium rounded-full {{ getStatutColor(recours.statut) }}">
              {{ recours.statut }}
            </span>
          </div>
        </div>
        
        <div class="mt-6">
          <p class="text-sm text-gray-600 mb-2">Description complète</p>
          <p class="text-gray-900 bg-gray-50 p-4 rounded-lg">{{ recours.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recours-detail {
      min-height: calc(100vh - 7rem);
    }
  `]
})
export class RecoursDetailComponent implements OnInit {
  recours: Recours | undefined;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recoursService: RecoursService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recoursService.getRecoursById(id).subscribe(recours => {
        this.recours = recours;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/recours']);
  }

  canProcessRecours(): boolean {
    if (!this.currentUser) return false;
    
    return this.currentUser.role === UserRole.SUPERVISEUR_RECOURS || 
           this.currentUser.role === UserRole.ADMIN ||
           this.currentUser.role === UserRole.AGENT_RECOURS;
  }

  getStatutColor(statut: string): string {
    const colors: { [key: string]: string } = {
      'NOUVEAU': 'bg-red-100 text-red-800',
      'EN_COURS': 'bg-yellow-100 text-yellow-800',
      'EN_ATTENTE_VALIDATION': 'bg-blue-100 text-blue-800',
      'VALIDE': 'bg-green-100 text-green-800',
      'REJETE': 'bg-red-100 text-red-800',
      'SUSPENDU': 'bg-gray-100 text-gray-800',
      'FERME': 'bg-gray-100 text-gray-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  }
}
