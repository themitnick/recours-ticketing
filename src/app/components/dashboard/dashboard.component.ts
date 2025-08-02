import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecoursService } from '../../services/recours.service';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  UserRole = UserRole;
  currentDate = new Date();
  
  // Stats générales
  totalRecours = 0;
  totalTickets = 0;
  recoursEnCours = 0;
  ticketsEnCours = 0;
  ticketsResolus = 0;
  recoursUrgents = 0;
  ticketsCritiques = 0;
  
  // Stats pour les graphiques
  recoursParStatut: any[] = [];
  ticketsParType: any[] = [];
  recoursParCanal: any[] = [];
  
  // Activités récentes
  activitesRecentes: any[] = [];
  
  // Demandes à traiter pour les superviseurs
  demandesATraiter: any[] = [];
  
  // Alertes
  alertes = [
    { type: 'warning', message: '3 recours approchent de leur échéance', date: new Date() },
    { type: 'info', message: 'Maintenance programmée ce weekend', date: new Date() },
    { type: 'error', message: '2 tickets critiques non assignés', date: new Date() }
  ];

  constructor(
    private recoursService: RecoursService,
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Charger les statistiques des recours
    this.recoursService.getStatistiques().subscribe(stats => {
      this.totalRecours = stats.total;
      this.recoursEnCours = stats.enCours;
      this.recoursUrgents = stats.nouveau; // Simulation
      
      // Préparer les données pour les graphiques - vérification de sécurité
      this.recoursParStatut = Object.entries(stats.parCanal || {}).map(([canal, count]) => ({
        label: this.getStatutLabel(canal),
        value: count,
        color: this.getStatutColor(canal)
      }));
      
      this.recoursParCanal = Object.entries(stats.parCanal || {}).map(([canal, count]) => ({
        label: this.getCanalLabel(canal),
        value: count,
        color: this.getCanalColor(canal)
      }));
    });

    // Charger les statistiques des tickets
    this.ticketService.getStatistiques().subscribe(stats => {
      this.totalTickets = stats.total;
      this.ticketsEnCours = stats.enCours;
      this.ticketsCritiques = stats.nouveau; // Simulation
      
      this.ticketsParType = Object.entries(stats.parType || {}).map(([type, count]) => ({
        label: this.getTypeLabel(type),
        value: count,
        color: this.getTypeColor(type)
      }));
    });

    // Simuler les activités récentes
    this.activitesRecentes = [
      { type: 'recours', action: 'Nouveau recours créé', details: 'REC-2024-001 - Litige facturation', time: '2 min' },
      { type: 'ticket', action: 'Ticket résolu', details: 'TKT-2024-003 - Problème VPN', time: '15 min' },
      { type: 'recours', action: 'Recours assigné', details: 'REC-2024-002 - Agent Marie Dupont', time: '1h' },
      { type: 'ticket', action: 'Nouveau ticket', details: 'TKT-2024-004 - Panne imprimante', time: '2h' }
    ];

    // Charger les demandes à traiter pour les superviseurs
    this.chargerDemandesATraiter();
  }

  private chargerDemandesATraiter(): void {
    if (!this.currentUser) return;

    // Générer des demandes selon le rôle du superviseur
    if (this.currentUser.role === UserRole.SUPERVISEUR_RECOURS || this.currentUser.role === UserRole.ADMIN) {
      this.demandesATraiter.push(
        {
          id: 1,
          numero: 'REC-2024-001',
          type: 'recours',
          typeRecours: 'CONTESTER_DECISION',
          titre: 'Contestation décision pénalité',
          description: 'Demande de recours concernant une pénalité de retard jugée excessive',
          demandeur: 'Jean Kouassi',
          dateCreation: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          statut: 'EN_COURS',
          priorite: 'HAUTE',
          montantConteste: 750000,
          assigneA: this.currentUser.email
        },
        {
          id: 2,
          numero: 'REC-2024-002',
          type: 'recours',
          typeRecours: 'DEMANDE_REMBOURSEMENT',
          titre: 'Demande de remboursement',
          description: 'Remboursement suite à un trop-perçu identifié lors du contrôle',
          demandeur: 'Marie Aya',
          dateCreation: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          statut: 'EN_COURS',
          priorite: 'NORMALE',
          montantConteste: 250000,
          assigneA: this.currentUser.email
        }
      );
    }

    if (this.currentUser.role === UserRole.SUPERVISEUR_IT || this.currentUser.role === UserRole.ADMIN) {
      this.demandesATraiter.push(
        {
          id: 3,
          numero: 'TKT-2024-001',
          type: 'ticket',
          titre: 'Problème accès système comptable',
          description: 'Impossible de se connecter au système comptable depuis ce matin',
          demandeur: 'Paul Bamba',
          dateCreation: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h
          statut: 'EN_COURS',
          priorite: 'CRITIQUE',
          typeTicket: 'PROBLEME_TECHNIQUE',
          assigneA: this.currentUser.email
        },
        {
          id: 4,
          numero: 'TKT-2024-002',
          type: 'ticket',
          titre: 'Demande nouveau compte utilisateur',
          description: 'Création compte pour nouvel employé du service comptabilité',
          demandeur: 'RH Service',
          dateCreation: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h
          statut: 'EN_COURS',
          priorite: 'NORMALE',
          typeTicket: 'DEMANDE_ACCES',
          assigneA: this.currentUser.email
        }
      );
    }
  }

  private getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'NOUVEAU': 'Nouveau',
      'EN_COURS': 'En cours',
      'RESOLU': 'Résolu',
      'FERME': 'Fermé'
    };
    return labels[statut] || statut;
  }

  private getStatutColor(statut: string): string {
    const colors: { [key: string]: string } = {
      'NOUVEAU': '#ef4444',
      'EN_COURS': '#f59e0b',
      'RESOLU': '#10b981',
      'FERME': '#6b7280'
    };
    return colors[statut] || '#6b7280';
  }

  private getCanalLabel(canal: string): string {
    const labels: { [key: string]: string } = {
      'SITE_WEB': 'Site Web',
      'TELEPHONE': 'Téléphone',
      'EMAIL': 'Email',
      'PHYSIQUE': 'Physique',
      'WHATSAPP': 'WhatsApp',
      'FACEBOOK': 'Facebook',
      'TWITTER': 'Twitter'
    };
    return labels[canal] || canal;
  }

  private getCanalColor(canal: string): string {
    const colors: { [key: string]: string } = {
      'SITE_WEB': '#3b82f6',
      'TELEPHONE': '#10b981',
      'EMAIL': '#f59e0b',
      'PHYSIQUE': '#8b5cf6',
      'WHATSAPP': '#059669',
      'FACEBOOK': '#1d4ed8',
      'TWITTER': '#0ea5e9'
    };
    return colors[canal] || '#6b7280';
  }

  private getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'PANNE_MATERIEL': 'Panne matériel',
      'PROBLEME_LOGICIEL': 'Problème logiciel',
      'DEMANDE_ACCES': 'Demande d\'accès',
      'INSTALLATION': 'Installation',
      'FORMATION': 'Formation',
      'MAINTENANCE': 'Maintenance',
      'AUTRE': 'Autre'
    };
    return labels[type] || type;
  }

  private getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'PANNE_MATERIEL': '#ef4444',
      'PROBLEME_LOGICIEL': '#f59e0b',
      'DEMANDE_ACCES': '#3b82f6',
      'INSTALLATION': '#10b981',
      'FORMATION': '#8b5cf6',
      'MAINTENANCE': '#f97316',
      'AUTRE': '#6b7280'
    };
    return colors[type] || '#6b7280';
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'error': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'warning': return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'info': return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getAlertColor(type: string): string {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  }

  canViewReports(): boolean {
    return this.authService.hasAnyRole([UserRole.ADMIN, UserRole.SUPERVISEUR_RECOURS, UserRole.SUPERVISEUR_IT]);
  }

  getAlerteClass(type: string): string {
    switch (type) {
      case 'urgent':
        return 'bg-danger-50 border-danger-200';
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-success-50 border-success-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  }

  getAlertTitle(type: string): string {
    switch (type) {
      case 'urgent':
        return 'Alerte urgente';
      case 'warning':
        return 'Attention requise';
      case 'info':
        return 'Information';
      case 'success':
        return 'Succès';
      default:
        return 'Notification';
    }
  }

  // Méthodes pour vérifier les rôles et permissions
  isSuperviseur(): boolean {
    return this.currentUser?.role === UserRole.SUPERVISEUR_RECOURS || 
           this.currentUser?.role === UserRole.SUPERVISEUR_IT ||
           this.currentUser?.role === UserRole.ADMIN;
  }

  canManageRecours(): boolean {
    return this.currentUser?.role === UserRole.SUPERVISEUR_RECOURS || 
           this.currentUser?.role === UserRole.ADMIN ||
           this.currentUser?.role === UserRole.UTILISATEUR;
  }

  canManageTickets(): boolean {
    return this.currentUser?.role === UserRole.SUPERVISEUR_IT || 
           this.currentUser?.role === UserRole.ADMIN ||
           this.currentUser?.role === UserRole.UTILISATEUR;
  }

  // Méthodes pour le traitement des demandes
  ouvrirTraitement(demande: any): void {
    if (demande.type === 'recours') {
      // Naviguer vers la page de traitement du recours
      window.location.href = `/recours/${demande.id}/traitement`;
    } else if (demande.type === 'ticket') {
      // Naviguer vers la page de traitement du ticket
      window.location.href = `/tickets/${demande.id}/traitement`;
    }
  }

  getPrioriteColor(priorite: string): string {
    const colors: { [key: string]: string } = {
      'CRITIQUE': 'text-red-600 bg-red-100',
      'HAUTE': 'text-orange-600 bg-orange-100',
      'NORMALE': 'text-blue-600 bg-blue-100',
      'BASSE': 'text-gray-600 bg-gray-100'
    };
    return colors[priorite] || 'text-gray-600 bg-gray-100';
  }

  getPrioriteIcon(priorite: string): string {
    const icons: { [key: string]: string } = {
      'CRITIQUE': '🔴',
      'HAUTE': '🟠',
      'NORMALE': '🔵',
      'BASSE': '⚪'
    };
    return icons[priorite] || '⚪';
  }
}
