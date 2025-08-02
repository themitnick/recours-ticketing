import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../services/ticket.service';
import { Ticket, StatutTicket, TypeTicket, PrioriteTicket } from '../../../models';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="ticket-list">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestion des Tickets IT</h1>
          <p class="text-gray-600 mt-1">{{ filteredTickets.length }} tickets au total</p>
        </div>
        <a routerLink="/tickets/nouveau" class="btn btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Nouveau Ticket
        </a>
      </div>

      <div class="card p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="form-label">Recherche</label>
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              placeholder="Numéro, titre..."
              class="form-input">
          </div>
          <div>
            <label class="form-label">Statut</label>
            <select [(ngModel)]="statusFilter" (change)="applyFilters()" class="form-select">
              <option value="">Tous</option>
              <option value="NOUVEAU">Nouveau</option>
              <option value="EN_COURS">En cours</option>
              <option value="RESOLU">Résolu</option>
              <option value="FERME">Fermé</option>
            </select>
          </div>
          <div>
            <label class="form-label">Type</label>
            <select [(ngModel)]="typeFilter" (change)="applyFilters()" class="form-select">
              <option value="">Tous</option>
              <option value="PANNE_MATERIEL">Panne matériel</option>
              <option value="PROBLEME_LOGICIEL">Problème logiciel</option>
              <option value="DEMANDE_ACCES">Demande d'accès</option>
            </select>
          </div>
          <div class="flex items-end">
            <button (click)="clearFilters()" class="btn btn-secondary w-full">Réinitialiser</button>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        @for (ticket of filteredTickets; track ticket.id) {
          <div class="card p-6 hover:shadow-lg transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-4">
                <h3 class="text-lg font-semibold text-gray-900">{{ ticket.numeroTicket }}</h3>
                <span class="px-2 py-1 text-xs font-medium rounded-full" [class]="getStatutBadgeClass(ticket.statut)">
                  {{ getStatutLabel(ticket.statut) }}
                </span>
                <span class="px-2 py-1 text-xs font-medium rounded-full" [class]="getPrioriteBadgeClass(ticket.priorite)">
                  {{ getPrioriteLabel(ticket.priorite) }}
                </span>
              </div>
              <a [routerLink]="['/tickets', ticket.id]" class="text-primary-600 hover:text-primary-700 font-medium">
                Voir détails
              </a>
            </div>
            
            <h4 class="font-medium text-gray-900 mb-2">{{ ticket.titre }}</h4>
            <p class="text-gray-600 text-sm mb-4">{{ ticket.description }}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Demandeur:</span>
                <span class="ml-1 font-medium">{{ ticket.demandeur }}</span>
              </div>
              <div>
                <span class="text-gray-500">Type:</span>
                <span class="ml-1 font-medium">{{ getTypeLabel(ticket.typeIncident) }}</span>
              </div>
              <div>
                <span class="text-gray-500">Date:</span>
                <span class="ml-1 font-medium">{{ formatDate(ticket.dateCreation) }}</span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .ticket-list {
      min-height: calc(100vh - 7rem);
    }
  `]
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  searchTerm = '';
  statusFilter = '';
  typeFilter = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.ticketService.getAllTickets().subscribe(tickets => {
      this.tickets = tickets;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter(ticket => {
      const matchesSearch = !this.searchTerm || 
        ticket.numeroTicket.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        ticket.titre.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || ticket.statut === this.statusFilter;
      const matchesType = !this.typeFilter || ticket.typeIncident === this.typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this.applyFilters();
  }

  getStatutBadgeClass(statut: StatutTicket): string {
    switch (statut) {
      case StatutTicket.NOUVEAU: return 'bg-red-100 text-red-800';
      case StatutTicket.EN_COURS: return 'bg-yellow-100 text-yellow-800';
      case StatutTicket.RESOLU: return 'bg-green-100 text-green-800';
      case StatutTicket.FERME: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPrioriteBadgeClass(priorite: PrioriteTicket): string {
    switch (priorite) {
      case PrioriteTicket.CRITIQUE: return 'bg-red-100 text-red-800';
      case PrioriteTicket.HAUTE: return 'bg-orange-100 text-orange-800';
      case PrioriteTicket.NORMALE: return 'bg-yellow-100 text-yellow-800';
      case PrioriteTicket.BASSE: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatutLabel(statut: StatutTicket): string {
    switch (statut) {
      case StatutTicket.NOUVEAU: return 'Nouveau';
      case StatutTicket.EN_COURS: return 'En cours';
      case StatutTicket.RESOLU: return 'Résolu';
      case StatutTicket.FERME: return 'Fermé';
      default: return statut;
    }
  }

  getPrioriteLabel(priorite: PrioriteTicket): string {
    switch (priorite) {
      case PrioriteTicket.CRITIQUE: return 'Critique';
      case PrioriteTicket.HAUTE: return 'Haute';
      case PrioriteTicket.NORMALE: return 'Normale';
      case PrioriteTicket.BASSE: return 'Basse';
      default: return priorite;
    }
  }

  getTypeLabel(type: TypeTicket): string {
    switch (type) {
      case TypeTicket.MATERIEL: return 'Matériel';
      case TypeTicket.LOGICIEL: return 'Logiciel';
      case TypeTicket.ACCES: return 'Accès';
      case TypeTicket.INCIDENT: return 'Incident';
      case TypeTicket.DEMANDE_SERVICE: return 'Demande de service';
      case TypeTicket.DEMANDE_CHANGEMENT: return 'Demande de changement';
      case TypeTicket.PROBLEME: return 'Problème';
      case TypeTicket.RESEAU: return 'Réseau';
      default: return type;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
