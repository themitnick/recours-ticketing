import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { 
  Ticket, 
  TypeTicket, 
  PrioriteTicket, 
  StatutTicket,
  CategorieTicket,
  ActionTicket,
  CommentaireTicket 
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  public tickets$ = this.ticketsSubject.asObservable();

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    const mockTickets: Ticket[] = [
      {
        id: '1',
        numero: 'TKT-2024-001',
        numeroTicket: 'TKT-2024-001',
        titre: 'Panne imprimante bureau 201',
        description: 'L\'imprimante HP LaserJet du bureau 201 ne répond plus. Voyant rouge allumé.',
        type: TypeTicket.MATERIEL,
        typeIncident: TypeTicket.MATERIEL,
        categorie: CategorieTicket.PRINTER,
        priorite: PrioriteTicket.NORMALE,
        statut: StatutTicket.NOUVEAU,
        demandeurId: 'marie.dupont',
        demandeurNom: 'Marie Dupont',
        demandeurEmail: 'marie.dupont@anare.ci',
        demandeur: 'Marie Dupont',
        dateCreation: new Date('2024-01-16'),
        dateModification: new Date('2024-01-16'),
        sla: {
          tempsReponse: 2,
          tempsResolution: 24,
          respecte: true
        },
        escalades: [],
        niveauEscalade: 1,
        materielConcerne: 'HP LaserJet Pro 400',
        fichiers: [],
        commentaires: [],
        actions: [
          {
            id: '1',
            action: 'CREATION',
            effectueePar: 'marie.dupont@anare.ci',
            dateAction: new Date('2024-01-16'),
            commentaire: 'Ticket créé par l\'utilisateur',
            statutAvant: StatutTicket.NOUVEAU,
            statutApres: StatutTicket.NOUVEAU
          }
        ],
        historique: []
      },
      {
        id: '2',
        numero: 'TKT-2024-002',
        numeroTicket: 'TKT-2024-002',
        titre: 'Problème connexion VPN',
        description: 'Impossible de se connecter au VPN depuis ce matin.',
        type: TypeTicket.LOGICIEL,
        typeIncident: TypeTicket.LOGICIEL,
        categorie: CategorieTicket.NETWORK,
        priorite: PrioriteTicket.HAUTE,
        statut: StatutTicket.EN_COURS,
        demandeurId: 'jean.kouassi',
        demandeurNom: 'Jean Kouassi',
        demandeurEmail: 'jean.kouassi@anare.ci',
        demandeur: 'Jean Kouassi',
        assigneA: 'technicien.it@anare.ci',
        dateCreation: new Date('2024-01-15'),
        dateModification: new Date('2024-01-15'),
        sla: {
          tempsReponse: 1,
          tempsResolution: 4,
          respecte: true
        },
        escalades: [],
        niveauEscalade: 1,
        logicielConcerne: 'Cisco AnyConnect',
        fichiers: [],
        commentaires: [],
        actions: [
          {
            id: '2',
            action: 'CREATION',
            effectueePar: 'jean.kouassi@anare.ci',
            dateAction: new Date('2024-01-15'),
            statutAvant: StatutTicket.NOUVEAU,
            statutApres: StatutTicket.NOUVEAU
          },
          {
            id: '3',
            action: 'ASSIGNATION',
            effectueePar: 'superviseur.it@anare.ci',
            dateAction: new Date('2024-01-15'),
            commentaire: 'Assigné au technicien IT',
            statutAvant: StatutTicket.NOUVEAU,
            statutApres: StatutTicket.EN_COURS
          }
        ],
        historique: []
      },
      {
        id: '3',
        numero: 'TKT-2024-003',
        numeroTicket: 'TKT-2024-003',
        titre: 'Demande création compte utilisateur',
        description: 'Création de compte pour nouveau employé - Département Marketing',
        type: TypeTicket.DEMANDE_SERVICE,
        typeIncident: TypeTicket.DEMANDE_SERVICE,
        categorie: CategorieTicket.ACCOUNT,
        priorite: PrioriteTicket.BASSE,
        statut: StatutTicket.RESOLU,
        demandeurId: 'rh.admin',
        demandeurNom: 'RH Admin',
        demandeurEmail: 'rh.admin@anare.ci',
        demandeur: 'RH Admin',
        assigneA: 'admin.it@anare.ci',
        dateCreation: new Date('2024-01-14'),
        dateModification: new Date('2024-01-14'),
        dateResolution: new Date('2024-01-14'),
        sla: {
          tempsReponse: 4,
          tempsResolution: 8,
          respecte: true
        },
        escalades: [],
        niveauEscalade: 1,
        fichiers: [],
        commentaires: [],
        actions: [
          {
            id: '4',
            action: 'CREATION',
            effectueePar: 'rh.admin@anare.ci',
            dateAction: new Date('2024-01-14'),
            statutAvant: StatutTicket.NOUVEAU,
            statutApres: StatutTicket.NOUVEAU
          },
          {
            id: '5',
            action: 'RESOLUTION',
            effectueePar: 'admin.it@anare.ci',
            dateAction: new Date('2024-01-14'),
            commentaire: 'Compte créé avec succès',
            statutAvant: StatutTicket.EN_COURS,
            statutApres: StatutTicket.RESOLU
          }
        ],
        historique: [],
        tempsResolution: 120 // 2 heures
      },
      {
        id: '4',
        numero: 'TKT-2025-004',
        numeroTicket: 'TKT-2025-004',
        titre: 'Problème accès email',
        description: 'Je n\'arrive plus à accéder à ma boîte email depuis hier. Messages d\'erreur de connexion.',
        type: TypeTicket.LOGICIEL,
        typeIncident: TypeTicket.LOGICIEL,
        categorie: CategorieTicket.EMAIL,
        priorite: PrioriteTicket.NORMALE,
        statut: StatutTicket.NOUVEAU,
        demandeurId: 'utilisateur',
        demandeurNom: 'Utilisateur Démo',
        demandeurEmail: 'utilisateur@anare-ci.org',
        demandeur: 'Utilisateur Démo',
        dateCreation: new Date('2025-01-30'),
        dateModification: new Date('2025-01-30'),
        sla: {
          tempsReponse: 2,
          tempsResolution: 8,
          respecte: true
        },
        escalades: [],
        niveauEscalade: 1,
        logicielConcerne: 'Microsoft Outlook',
        fichiers: [],
        commentaires: [],
        actions: [
          {
            id: '4',
            action: 'CREATION',
            effectueePar: 'utilisateur@anare-ci.org',
            dateAction: new Date('2025-01-30'),
            statutAvant: StatutTicket.NOUVEAU,
            statutApres: StatutTicket.NOUVEAU
          }
        ],
        historique: []
      }
    ];

    // Mise à jour de l'alias historique pour chaque ticket
    mockTickets.forEach(ticket => {
      ticket.historique = ticket.actions;
    });

    this.ticketsSubject.next(mockTickets);
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.tickets$;
  }

  getTicketById(id: string): Observable<Ticket | undefined> {
    const tickets = this.ticketsSubject.value;
    return of(tickets.find(t => t.id === id));
  }

  createTicket(ticketData: any): Observable<Ticket> {
    const tickets = this.ticketsSubject.value;
    const newTicket: Ticket = {
      id: Date.now().toString(),
      numero: `TKT-2024-${String(tickets.length + 1).padStart(3, '0')}`,
      numeroTicket: `TKT-2024-${String(tickets.length + 1).padStart(3, '0')}`,
      titre: ticketData.titre,
      description: ticketData.description,
      type: ticketData.type || TypeTicket.INCIDENT,
      typeIncident: ticketData.type || TypeTicket.INCIDENT,
      categorie: ticketData.categorie || CategorieTicket.OTHER,
      priorite: ticketData.priorite || PrioriteTicket.NORMALE,
      statut: StatutTicket.NOUVEAU,
      demandeurId: ticketData.demandeurId || 'user',
      demandeurNom: ticketData.demandeurNom || 'Utilisateur',
      demandeurEmail: ticketData.demandeurEmail || 'user@anare.ci',
      demandeur: ticketData.demandeurNom || 'Utilisateur',
      dateCreation: new Date(),
      dateModification: new Date(),
      sla: {
        tempsReponse: 2,
        tempsResolution: 24,
        respecte: true
      },
      escalades: [],
      niveauEscalade: 1,
      fichiers: ticketData.fichiers || [],
      commentaires: [],
      actions: [
        {
          id: Date.now().toString(),
          action: 'CREATION',
          effectueePar: ticketData.demandeurEmail || 'user@anare.ci',
          dateAction: new Date(),
          commentaire: 'Ticket créé',
          statutAvant: StatutTicket.NOUVEAU,
          statutApres: StatutTicket.NOUVEAU
        }
      ],
      historique: []
    };

    newTicket.historique = newTicket.actions;

    const updatedTickets = [...tickets, newTicket];
    this.ticketsSubject.next(updatedTickets);
    
    return of(newTicket);
  }

  updateTicketStatus(ticketId: string, newStatus: StatutTicket, comment?: string): Observable<Ticket | null> {
    const tickets = this.ticketsSubject.value;
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      return of(null);
    }

    const ticket = tickets[ticketIndex];
    const oldStatus = ticket.statut;
    
    // Créer une nouvelle action
    const newAction: ActionTicket = {
      id: Date.now().toString(),
      action: 'CHANGEMENT_STATUT',
      effectueePar: 'system@anare.ci',
      dateAction: new Date(),
      commentaire: comment || `Statut changé de ${oldStatus} vers ${newStatus}`,
      statutAvant: oldStatus,
      statutApres: newStatus
    };

    // Mettre à jour le ticket
    const updatedTicket = {
      ...ticket,
      statut: newStatus,
      dateModification: new Date(),
      actions: [...ticket.actions, newAction]
    };

    updatedTicket.historique = updatedTicket.actions;

    tickets[ticketIndex] = updatedTicket;
    this.ticketsSubject.next(tickets);
    
    return of(updatedTicket);
  }

  assignTicket(ticketId: string, assigneTo: string): Observable<Ticket | null> {
    const tickets = this.ticketsSubject.value;
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      return of(null);
    }

    const ticket = tickets[ticketIndex];
    
    const newAction: ActionTicket = {
      id: Date.now().toString(),
      action: 'ASSIGNATION',
      effectueePar: 'system@anare.ci',
      dateAction: new Date(),
      commentaire: `Ticket assigné à ${assigneTo}`,
      statutAvant: ticket.statut,
      statutApres: ticket.statut
    };

    const updatedTicket = {
      ...ticket,
      assigneA: assigneTo,
      dateModification: new Date(),
      actions: [...ticket.actions, newAction]
    };

    updatedTicket.historique = updatedTicket.actions;

    tickets[ticketIndex] = updatedTicket;
    this.ticketsSubject.next(tickets);
    
    return of(updatedTicket);
  }

  getTicketsByStatus(status: StatutTicket): Observable<Ticket[]> {
    const tickets = this.ticketsSubject.value;
    return of(tickets.filter(t => t.statut === status));
  }

  getTicketsByPriority(priority: PrioriteTicket): Observable<Ticket[]> {
    const tickets = this.ticketsSubject.value;
    return of(tickets.filter(t => t.priorite === priority));
  }

  getStatistiques(): Observable<any> {
    return this.getStatistics();
  }

  getStatistics(): Observable<any> {
    const tickets = this.ticketsSubject.value;
    
    const stats = {
      total: tickets.length,
      nouveau: tickets.filter(t => t.statut === StatutTicket.NOUVEAU).length,
      enCours: tickets.filter(t => t.statut === StatutTicket.EN_COURS).length,
      resolu: tickets.filter(t => t.statut === StatutTicket.RESOLU).length,
      ferme: tickets.filter(t => t.statut === StatutTicket.FERME).length,
      haute: tickets.filter(t => t.priorite === PrioriteTicket.HAUTE).length,
      critique: tickets.filter(t => t.priorite === PrioriteTicket.CRITIQUE).length,
      tempsResolutionMoyen: this.calculateAverageResolutionTime(tickets)
    };
    
    return of(stats);
  }

  private calculateAverageResolutionTime(tickets: Ticket[]): number {
    const resolvedTickets = tickets.filter(t => t.dateResolution);
    if (resolvedTickets.length === 0) return 0;
    
    const totalTime = resolvedTickets.reduce((sum, ticket) => {
      if (ticket.dateResolution && ticket.dateCreation) {
        const diffMs = ticket.dateResolution.getTime() - ticket.dateCreation.getTime();
        return sum + (diffMs / (1000 * 60 * 60)); // Convert to hours
      }
      return sum;
    }, 0);
    
    return Math.round(totalTime / resolvedTickets.length * 100) / 100;
  }
}
