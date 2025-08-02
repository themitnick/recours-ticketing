// Export des nouveaux modèles de façon simple pour éviter les conflits
export * from './recours.model';
export * from './ticket.model';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: UserRole;
  departement?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT_RECOURS = 'AGENT_RECOURS',
  SUPERVISEUR_RECOURS = 'SUPERVISEUR_RECOURS',
  TECHNICIEN_IT = 'TECHNICIEN_IT',
  SUPERVISEUR_IT = 'SUPERVISEUR_IT',
  UTILISATEUR = 'UTILISATEUR'
}

// Interfaces pour la compatibilité (anciennes interfaces qui ne sont pas dans les nouveaux modèles)
export interface PieceJointe {
  id: string;
  nom: string;
  url: string;
  taille: number;
  type: string;
  dateUpload: Date;
}

export interface EvaluationSatisfaction {
  note: number; // 1-5
  commentaire?: string;
  dateEvaluation: Date;
}

export interface KPI {
  periode: string;
  nombreRecours: number;
  nombreTickets: number;
  tempsResolutionMoyen: number;
  tauxSatisfaction: number;
  recoursParCanal: { [canal: string]: number };
  ticketsParType: { [type: string]: number };
}

export interface Dashboard {
  kpiRecours: KPIRecours;
  kpiTickets: KPITickets;
  alertes: Alerte[];
}

export interface KPIRecours {
  totalRecours: number;
  recoursEnCours: number;
  recoursResolus: number;
  tempsResolutionMoyen: number;
  tauxSatisfaction: number;
  recoursParStatut: { [statut: string]: number };
  recoursParCanal: { [canal: string]: number };
}

export interface KPITickets {
  totalTickets: number;
  ticketsEnCours: number;
  ticketsResolus: number;
  tempsResolutionMoyen: number;
  tauxSatisfaction: number;
  ticketsParStatut: { [statut: string]: number };
  ticketsParType: { [type: string]: number };
}

export interface Alerte {
  id: string;
  type: 'WARNING' | 'ERROR' | 'INFO';
  titre: string;
  message: string;
  date: Date;
  isRead: boolean;
}
