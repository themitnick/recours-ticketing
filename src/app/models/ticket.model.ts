export enum StatutTicket {
  NOUVEAU = 'NOUVEAU',
  OUVERT = 'OUVERT',
  EN_COURS = 'EN_COURS',
  ATTENTE_UTILISATEUR = 'ATTENTE_UTILISATEUR',
  ATTENTE_FOURNISSEUR = 'ATTENTE_FOURNISSEUR',
  ESCALADE = 'ESCALADE',
  RESOLU = 'RESOLU',
  FERME = 'FERME',
  ANNULE = 'ANNULE'
}

export enum PrioriteTicket {
  BASSE = 'BASSE',
  NORMALE = 'NORMALE',
  HAUTE = 'HAUTE',
  CRITIQUE = 'CRITIQUE'
}

export enum TypeTicket {
  INCIDENT = 'INCIDENT',
  DEMANDE_SERVICE = 'DEMANDE_SERVICE',
  DEMANDE_CHANGEMENT = 'DEMANDE_CHANGEMENT',
  PROBLEME = 'PROBLEME',
  ACCES = 'ACCES',
  MATERIEL = 'MATERIEL',
  LOGICIEL = 'LOGICIEL',
  RESEAU = 'RESEAU'
}

export enum CategorieTicket {
  HARDWARE = 'HARDWARE',
  SOFTWARE = 'SOFTWARE',
  NETWORK = 'NETWORK',
  SECURITY = 'SECURITY',
  ACCOUNT = 'ACCOUNT',
  EMAIL = 'EMAIL',
  PRINTER = 'PRINTER',
  PHONE = 'PHONE',
  OTHER = 'OTHER'
}

import { Fichier } from './recours.model';

export interface SLA {
  tempsReponse: number; // en heures
  tempsResolution: number; // en heures
  respecte: boolean;
}

export interface CommentaireTicket {
  id: string;
  auteur: string;
  contenu: string;
  dateCreation: Date;
  type: 'INTERNE' | 'PUBLIC' | 'SYSTEME';
  fichiers?: Fichier[];
  tempsPassé?: number; // en minutes
}

export interface ActionTicket {
  id: string;
  action: string;
  effectueePar: string;
  dateAction: Date;
  commentaire?: string;
  statutAvant: StatutTicket;
  statutApres: StatutTicket;
}

export interface EscaladeTicket {
  id: string;
  motif: string;
  escaladePar: string;
  escaladeVers: string;
  dateEscalade: Date;
  commentaire?: string;
}

export interface Ticket {
  id: string;
  numero: string;
  numeroTicket: string; // Alias pour compatibilité
  titre: string;
  description: string;
  type: TypeTicket;
  categorie: CategorieTicket;
  statut: StatutTicket;
  priorite: PrioriteTicket;
  
  // Informations demandeur
  demandeurId: string;
  demandeurNom: string;
  demandeurEmail: string;
  demandeurTelephone?: string;
  departement?: string;
  
  // Propriétés de compatibilité
  demandeur: string; // Alias pour demandeurNom
  typeIncident: TypeTicket; // Alias pour type
  
  // Traitement
  assigneA?: string;
  equipeId?: string;
  superviseurId?: string;
  
  // Dates et SLA
  dateCreation: Date;
  dateModification: Date;
  datePremiereReponse?: Date;
  dateResolution?: Date;
  dateFermeture?: Date;
  sla: SLA;
  
  // Escalade
  escalades: EscaladeTicket[];
  niveauEscalade: number; // 1, 2, 3
  
  // Localisation/Contexte
  localisation?: string;
  materielConcerne?: string;
  logicielConcerne?: string;
  
  // Fichiers et commentaires
  fichiers: Fichier[];
  commentaires: CommentaireTicket[];
  actions: ActionTicket[];
  historique: ActionTicket[]; // Alias pour actions (compatibilité)
  
  // Métriques
  tempsTotal?: number; // en heures
  tempsEffectif?: number; // temps réellement passé
  tempsResolution?: number; // temps de résolution en minutes
  satisfactionUtilisateur?: number; // 1-5
  coutResolution?: number;
  
  // Relations
  ticketsLies?: string[]; // IDs des tickets liés
  ticketParent?: string; // Pour les sous-tickets
}
