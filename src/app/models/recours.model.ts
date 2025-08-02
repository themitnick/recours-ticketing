export enum StatutRecours {
  BROUILLON = 'BROUILLON',
  SOUMIS = 'SOUMIS',
  EN_COURS_ANALYSE = 'EN_COURS_ANALYSE',
  ATTENTE_INFORMATIONS = 'ATTENTE_INFORMATIONS',
  EN_COURS_TRAITEMENT = 'EN_COURS_TRAITEMENT',
  VALIDE_NIVEAU_1 = 'VALIDE_NIVEAU_1',
  VALIDE_NIVEAU_2 = 'VALIDE_NIVEAU_2',
  REJETE = 'REJETE',
  RESOLU = 'RESOLU',
  FERME = 'FERME',
  // Alias pour compatibilité
  NOUVEAU = 'SOUMIS',
  EN_COURS = 'EN_COURS_TRAITEMENT',
  EN_ATTENTE = 'ATTENTE_INFORMATIONS'
}

export enum PrioriteRecours {
  BASSE = 'BASSE',
  NORMALE = 'NORMALE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}

export enum TypeRecours {
  TECHNIQUE = 'TECHNIQUE',
  FACTURATION = 'FACTURATION',
  SERVICE_CLIENT = 'SERVICE_CLIENT',
  COMMERCIAL = 'COMMERCIAL',
  JURIDIQUE = 'JURIDIQUE',
  LITIGE_FACTURATION = 'LITIGE_FACTURATION',
  QUALITE_SERVICE = 'QUALITE_SERVICE',
  COUPURE_ABUSIVE = 'COUPURE_ABUSIVE',
  RACCORDEMENT = 'RACCORDEMENT',
  AUTRE = 'AUTRE'
}

export enum CanalEntree {
  TELEPHONE = 'TELEPHONE',
  EMAIL = 'EMAIL',
  COURRIER = 'COURRIER',
  SITE_WEB = 'SITE_WEB',
  AGENCE = 'AGENCE',
  SMS = 'SMS',
  PHYSIQUE = 'PHYSIQUE',
  WHATSAPP = 'WHATSAPP',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER'
}

export interface Fichier {
  id: string;
  nom: string;
  taille: number;
  type: string;
  url?: string;
  dateUpload: Date;
  uploadePar: string;
}

export interface CommentaireRecours {
  id: string;
  auteur: string;
  contenu: string;
  dateCreation: Date;
  type: 'INTERNE' | 'CLIENT' | 'SYSTEME';
  fichiers?: Fichier[];
}

export interface ActionRecours {
  id: string;
  action: string;
  effectueePar: string;
  dateAction: Date;
  commentaire?: string;
  statutAvant: StatutRecours;
  statutApres: StatutRecours;
}

export interface Recours {
  id: string;
  numero: string;
  numeroRecours: string; // Alias pour compatibilité
  titre: string;
  description: string;
  type: TypeRecours;
  typeRecours: TypeRecours; // Alias pour compatibilité
  statut: StatutRecours;
  priorite: PrioriteRecours;
  
  // Informations client
  clientId: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone?: string;
  
  // Propriétés de compatibilité pour requérant
  requrantNom: string; // Alias pour clientNom
  requrantPrenom: string; // Nouveau champ
  requrantEmail: string; // Alias pour clientEmail
  requrantTelephone?: string; // Alias pour clientTelephone
  
  // Canal d'entrée
  canalEntree: CanalEntree;
  
  // Montant du litige
  montantLitige?: number;
  
  // Traitement
  assigneA?: string;
  superviseurId?: string;
  
  // Dates
  dateCreation: Date;
  dateModification: Date;
  dateEcheance?: Date;
  dateResolution?: Date;
  
  // Workflow
  niveauValidation: number; // 0, 1, 2
  validateurs: {
    niveau1?: string;
    niveau2?: string;
    dateValidationNiveau1?: Date;
    dateValidationNiveau2?: Date;
  };
  
  // Fichiers et commentaires
  fichiers: Fichier[];
  commentaires: CommentaireRecours[];
  actions: ActionRecours[];
  
  // Métriques
  tempsTraitement?: number; // en heures
  satisfactionClient?: number; // 1-5
}
