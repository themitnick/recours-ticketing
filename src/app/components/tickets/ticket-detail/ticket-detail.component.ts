import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth.service';
import { Ticket, User, UserRole } from '../../../models';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="ticket-detail" *ngIf="ticket">
      <!-- En-tête avec navigation -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <button (click)="goBack()" class="text-primary-600 hover:text-primary-700 mb-4 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Retour à la liste
          </button>
          <h1 class="text-2xl font-bold text-gray-900">🎫 Ticket {{ ticket.numeroTicket }}</h1>
          <p class="text-gray-600 mt-1">Consultation du détail et traitement du ticket IT</p>
        </div>
        
        <!-- Bouton Traitement (pour superviseurs IT) -->
        <div *ngIf="canProcessTicket()" class="flex space-x-3">
          <button 
            [routerLink]="['/tickets', ticket.id, 'traitement']" 
            class="inline-flex items-center px-4 py-2 border border-purple-300 text-sm font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            🔧 Traitement du ticket
          </button>
        </div>
      </div>

      <!-- Résumé de la demande (toujours visible) -->
      <div class="card p-6 mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <div class="flex items-center mb-4">
          <div class="p-2 bg-purple-100 rounded-lg mr-3">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1V7a2 2 0 00-2-2H5zM5 14a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2H5z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-purple-900">🎫 Résumé du Ticket</h2>
            <p class="text-sm text-purple-700">{{ ticket.typeIncident }} • {{ ticket.priorite }}</p>
          </div>
          <div class="ml-auto">
            <span class="px-3 py-1 text-sm font-medium rounded-full {{ getStatutColor(ticket.statut) }}">
              {{ ticket.statut }}
            </span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p class="text-purple-600 font-medium">👤 Demandeur</p>
            <p class="text-purple-900">{{ ticket.demandeur }}</p>
            <p class="text-purple-700">Ticket IT</p>
          </div>
          <div>
            <p class="text-purple-600 font-medium">📅 Dates importantes</p>
            <p class="text-purple-900">Créé le {{ ticket.dateCreation | date:'dd/MM/yyyy' }}</p>
            <p class="text-purple-700">Assigné à {{ ticket.assigneA || 'Non assigné' }}</p>
          </div>
          <div>
            <p class="text-purple-600 font-medium">⚡ Urgence & Impact</p>
            <p class="text-purple-900">Priorité: {{ ticket.priorite }}</p>
            <p class="text-purple-700">Type: {{ ticket.typeIncident }}</p>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-purple-200">
          <p class="text-purple-600 font-medium mb-2">📝 Description</p>
          <p class="text-purple-900">{{ ticket.description }}</p>
        </div>
      </div>
      
      <!-- Détails complets -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Informations techniques détaillées
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm text-gray-600">Titre</p>
            <p class="font-medium">{{ ticket.titre }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Demandeur</p>
            <p class="font-medium">{{ ticket.demandeur }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Type d'incident</p>
            <p class="font-medium">{{ ticket.typeIncident }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Priorité</p>
            <span class="px-2 py-1 text-xs font-medium rounded-full {{ getPrioriteColor(ticket.priorite) }}">
              {{ ticket.priorite }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-600">Statut</p>
            <span class="px-2 py-1 text-xs font-medium rounded-full {{ getStatutColor(ticket.statut) }}">
              {{ ticket.statut }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-600">Assigné à</p>
            <p class="font-medium">{{ ticket.assigneA || 'Non assigné' }}</p>
          </div>
        </div>
        
        <div class="mt-6">
          <p class="text-sm text-gray-600 mb-2">Description technique complète</p>
          <p class="text-gray-900 bg-gray-50 p-4 rounded-lg">{{ ticket.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ticket-detail {
      min-height: calc(100vh - 7rem);
    }
  `]
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | undefined;
  currentUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ticketService.getTicketById(id).subscribe(ticket => {
        this.ticket = ticket;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }

  canProcessTicket(): boolean {
    if (!this.currentUser) return false;
    
    return this.currentUser.role === UserRole.SUPERVISEUR_IT || 
           this.currentUser.role === UserRole.ADMIN ||
           this.currentUser.role === UserRole.TECHNICIEN_IT;
  }

  getStatutColor(statut: string): string {
    const colors: { [key: string]: string } = {
      'NOUVEAU': 'bg-red-100 text-red-800',
      'EN_COURS': 'bg-yellow-100 text-yellow-800',
      'EN_ATTENTE': 'bg-blue-100 text-blue-800',
      'RESOLU': 'bg-green-100 text-green-800',
      'FERME': 'bg-gray-100 text-gray-800',
      'SUSPENDU': 'bg-gray-100 text-gray-800'
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  }

  getPrioriteColor(priorite: string): string {
    const colors: { [key: string]: string } = {
      'CRITIQUE': 'bg-red-100 text-red-800',
      'HAUTE': 'bg-orange-100 text-orange-800',
      'NORMALE': 'bg-blue-100 text-blue-800',
      'BASSE': 'bg-gray-100 text-gray-800'
    };
    return colors[priorite] || 'bg-gray-100 text-gray-800';
  }
}
