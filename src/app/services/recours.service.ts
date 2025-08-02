import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Recours, 
  StatutRecours, 
  PrioriteRecours, 
  TypeRecours, 
  CanalEntree,
  CommentaireRecours, 
  ActionRecours,
  Fichier 
} from '../models/recours.model';

@Injectable({
  providedIn: 'root'
})
export class RecoursService {
  private recoursSubject = new BehaviorSubject<Recours[]>([]);
  public recours$ = this.recoursSubject.asObservable();

  private mockRecours: Recours[] = [
    {
      id: '1',
      numero: 'REC-2025-001',
      numeroRecours: 'REC-2025-001',
      titre: 'Contestation facture janvier 2025',
      description: 'Je conteste les frais supplémentaires facturés sur ma ligne principale car ils ne correspondent pas à mon forfait.',
      type: TypeRecours.FACTURATION,
      typeRecours: TypeRecours.FACTURATION,
      statut: StatutRecours.EN_COURS,
      priorite: PrioriteRecours.NORMALE,
      clientId: '4',
      clientNom: 'Fatou Ouattara',
      clientEmail: 'utilisateur@anare-ci.org',
      clientTelephone: '+225 07 12 34 56 81',
      requrantNom: 'Ouattara',
      requrantPrenom: 'Fatou',
      requrantEmail: 'utilisateur@anare-ci.org',
      requrantTelephone: '+225 07 12 34 56 81',
      canalEntree: CanalEntree.EMAIL,
      montantLitige: 25000,
      assigneA: 'superviseur.recours@anare-ci.org',
      dateCreation: new Date('2025-01-15'),
      dateModification: new Date(),
      dateEcheance: new Date('2025-02-15'),
      niveauValidation: 0,
      validateurs: {},
      fichiers: [],
      commentaires: [
        {
          id: '1',
          auteur: 'Fatou Ouattara',
          contenu: 'Demande initiale créée automatiquement',
          dateCreation: new Date('2025-01-15'),
          type: 'CLIENT'
        },
        {
          id: '2',
          auteur: 'Aminata Konaté',
          contenu: 'Prise en charge du dossier. Analyse en cours.',
          dateCreation: new Date('2025-01-16'),
          type: 'INTERNE'
        }
      ],
      actions: [
        {
          id: '1',
          action: 'Création du recours',
          effectueePar: 'Fatou Ouattara',
          dateAction: new Date('2025-01-15'),
          statutAvant: StatutRecours.BROUILLON,
          statutApres: StatutRecours.SOUMIS
        },
        {
          id: '2',
          action: 'Prise en charge',
          effectueePar: 'Aminata Konaté',
          dateAction: new Date('2025-01-16'),
          statutAvant: StatutRecours.SOUMIS,
          statutApres: StatutRecours.EN_COURS_ANALYSE
        }
      ]
    },
    {
      id: '2',
      numero: 'REC-2025-002',
      numeroRecours: 'REC-2025-002',
      titre: 'Demande de remboursement trop-perçu',
      description: 'Suite à un contrôle de facturation, j\'ai identifié un trop-perçu de 150 000 FCFA sur les 6 derniers mois. Je demande le remboursement.',
      type: TypeRecours.FACTURATION,
      typeRecours: TypeRecours.FACTURATION,
      statut: StatutRecours.EN_COURS,
      priorite: PrioriteRecours.HAUTE,
      clientId: '5',
      clientNom: 'Koné',
      clientEmail: 'kone.marie@entreprise.ci',
      clientTelephone: '+225 05 67 89 01 23',
      requrantNom: 'Koné',
      requrantPrenom: 'Marie',
      requrantEmail: 'kone.marie@entreprise.ci',
      requrantTelephone: '+225 05 67 89 01 23',
      canalEntree: CanalEntree.AGENCE,
      montantLitige: 150000,
      assigneA: 'superviseur.recours@anare-ci.org',
      dateCreation: new Date('2025-01-20'),
      dateModification: new Date(),
      dateEcheance: new Date('2025-02-20'),
      niveauValidation: 0,
      validateurs: {},
      fichiers: [],
      commentaires: [],
      actions: []
    },
    {
      id: '3',
      numero: 'REC-2025-003',
      numeroRecours: 'REC-2025-003',
      titre: 'Contestation coupure abusive',
      description: 'Ma ligne a été coupée alors que mes factures sont à jour. Je demande le rétablissement immédiat et une indemnisation.',
      type: TypeRecours.COUPURE_ABUSIVE,
      typeRecours: TypeRecours.COUPURE_ABUSIVE,
      statut: StatutRecours.NOUVEAU,
      priorite: PrioriteRecours.URGENTE,
      clientId: '6',
      clientNom: 'Bamba',
      clientEmail: 'paul.bamba@gmail.com',
      clientTelephone: '+225 01 23 45 67 89',
      requrantNom: 'Bamba',
      requrantPrenom: 'Paul',
      requrantEmail: 'paul.bamba@gmail.com',
      requrantTelephone: '+225 01 23 45 67 89',
      canalEntree: CanalEntree.TELEPHONE,
      montantLitige: 0,
      assigneA: 'superviseur.recours@anare-ci.org',
      dateCreation: new Date('2025-01-25'),
      dateModification: new Date(),
      dateEcheance: new Date('2025-02-25'),
      niveauValidation: 0,
      validateurs: {},
      fichiers: [],
      commentaires: [],
      actions: []
    },
    {
      id: '4',
      numero: 'REC-2025-004',
      numeroRecours: 'REC-2025-004',
      titre: 'Qualité de service dégradée',
      description: 'Depuis 3 mois, la qualité de ma connexion internet est très mauvaise. Débit faible, coupures fréquentes. Demande de compensation.',
      type: TypeRecours.QUALITE_SERVICE,
      typeRecours: TypeRecours.QUALITE_SERVICE,
      statut: StatutRecours.EN_ATTENTE,
      priorite: PrioriteRecours.NORMALE,
      clientId: '7',
      clientNom: 'Traoré',
      clientEmail: 'ibrahim.traore@yahoo.fr',
      clientTelephone: '+225 07 98 76 54 32',
      requrantNom: 'Traoré',
      requrantPrenom: 'Ibrahim',
      requrantEmail: 'ibrahim.traore@yahoo.fr',
      requrantTelephone: '+225 07 98 76 54 32',
      canalEntree: CanalEntree.SITE_WEB,
      montantLitige: 75000,
      assigneA: 'superviseur.recours@anare-ci.org',
      dateCreation: new Date('2025-01-28'),
      dateModification: new Date(),
      dateEcheance: new Date('2025-02-28'),
      niveauValidation: 0,
      validateurs: {},
      fichiers: [],
      commentaires: [],
      actions: []
    },
    {
      id: '5',
      numero: 'REC-2025-005',
      numeroRecours: 'REC-2025-005',
      titre: 'Problème raccordement nouveau local',
      description: 'Demande de raccordement déposée il y a 2 mois, toujours pas de nouvelles. Besoin urgent pour ouverture commerce.',
      type: TypeRecours.RACCORDEMENT,
      typeRecours: TypeRecours.RACCORDEMENT,
      statut: StatutRecours.EN_COURS,
      priorite: PrioriteRecours.HAUTE,
      clientId: '8',
      clientNom: 'Diabaté',
      clientEmail: 'awa.diabate@commerce.ci',
      clientTelephone: '+225 05 11 22 33 44',
      requrantNom: 'Diabaté',
      requrantPrenom: 'Awa',
      requrantEmail: 'awa.diabate@commerce.ci',
      requrantTelephone: '+225 05 11 22 33 44',
      canalEntree: CanalEntree.AGENCE,
      montantLitige: 0,
      assigneA: 'superviseur.recours@anare-ci.org',
      dateCreation: new Date('2025-01-30'),
      dateModification: new Date(),
      dateEcheance: new Date('2025-03-01'),
      niveauValidation: 0,
      validateurs: {},
      fichiers: [],
      commentaires: [],
      actions: []
    },
    {
      id: '6',
      numero: 'REC-2025-006',
      numeroRecours: 'REC-2025-006',
      titre: 'Demande de remboursement suite à coupure',
      description: 'Ma ligne a été coupée pendant 3 jours sans préavis. Je demande un remboursement proportionnel à la durée de la coupure.',
      type: TypeRecours.FACTURATION,
      typeRecours: TypeRecours.FACTURATION,
      statut: StatutRecours.NOUVEAU,
      priorite: PrioriteRecours.NORMALE,
      clientId: '4',
      clientNom: 'Utilisateur Démo',
      clientEmail: 'utilisateur@anare-ci.org',
      clientTelephone: '+225 07 98 76 54 32',
      requrantNom: 'Démo',
      requrantPrenom: 'Utilisateur',
      requrantEmail: 'utilisateur@anare-ci.org',
      requrantTelephone: '+225 07 98 76 54 32',
      canalEntree: CanalEntree.SITE_WEB,
      montantLitige: 15000,
      assigneA: 'superviseur.recours@anare-ci.org',
      dateCreation: new Date('2025-02-01'),
      dateModification: new Date(),
      dateEcheance: new Date('2025-03-03'),
      niveauValidation: 0,
      validateurs: {},
      fichiers: [],
      commentaires: [],
      actions: []
    }
  ];

  constructor() {
    this.recoursSubject.next(this.mockRecours);
  }

  getRecours(): Observable<Recours[]> {
    return this.recours$;
  }

  getRecoursById(id: string): Observable<Recours | undefined> {
    return of(this.mockRecours.find(r => r.id === id));
  }

  creerRecours(recours: Partial<Recours>): Observable<Recours> {
    const nouveauRecours: Recours = {
      id: this.generateId(),
      numero: this.generateNumero(),
      numeroRecours: this.generateNumero(),
      titre: recours.titre || '',
      description: recours.description || '',
      type: recours.type || TypeRecours.TECHNIQUE,
      typeRecours: recours.type || TypeRecours.TECHNIQUE,
      statut: StatutRecours.BROUILLON,
      priorite: recours.priorite || PrioriteRecours.NORMALE,
      clientId: recours.clientId || '',
      clientNom: recours.clientNom || '',
      clientEmail: recours.clientEmail || '',
      clientTelephone: recours.clientTelephone,
      requrantNom: recours.requrantNom || recours.clientNom || '',
      requrantPrenom: recours.requrantPrenom || '',
      requrantEmail: recours.requrantEmail || recours.clientEmail || '',
      requrantTelephone: recours.requrantTelephone || recours.clientTelephone,
      canalEntree: recours.canalEntree || CanalEntree.EMAIL,
      montantLitige: recours.montantLitige,
      dateCreation: new Date(),
      dateModification: new Date(),
      niveauValidation: 0,
      validateurs: {},
      fichiers: recours.fichiers || [],
      commentaires: [],
      actions: []
    };

    this.mockRecours.push(nouveauRecours);
    this.recoursSubject.next([...this.mockRecours]);
    
    return of(nouveauRecours);
  }

  mettreAJourRecours(id: string, updates: Partial<Recours>): Observable<Recours> {
    const index = this.mockRecours.findIndex(r => r.id === id);
    if (index !== -1) {
      const recours = { ...this.mockRecours[index], ...updates, dateModification: new Date() };
      this.mockRecours[index] = recours;
      this.recoursSubject.next([...this.mockRecours]);
      return of(recours);
    }
    throw new Error('Recours non trouvé');
  }

  changerStatut(id: string, nouveauStatut: StatutRecours, commentaire?: string, utilisateur?: string): Observable<Recours> {
    const recours = this.mockRecours.find(r => r.id === id);
    if (!recours) {
      throw new Error('Recours non trouvé');
    }

    const action: ActionRecours = {
      id: this.generateId(),
      action: `Changement de statut vers ${nouveauStatut}`,
      effectueePar: utilisateur || 'Système',
      dateAction: new Date(),
      commentaire: commentaire,
      statutAvant: recours.statut,
      statutApres: nouveauStatut
    };

    recours.statut = nouveauStatut;
    recours.actions.push(action);
    recours.dateModification = new Date();

    if (commentaire) {
      const commentaireObj: CommentaireRecours = {
        id: this.generateId(),
        auteur: utilisateur || 'Système',
        contenu: commentaire,
        dateCreation: new Date(),
        type: 'INTERNE'
      };
      recours.commentaires.push(commentaireObj);
    }

    // Gestion du workflow de validation
    if (nouveauStatut === StatutRecours.VALIDE_NIVEAU_1) {
      recours.niveauValidation = 1;
      recours.validateurs.niveau1 = utilisateur;
      recours.validateurs.dateValidationNiveau1 = new Date();
    } else if (nouveauStatut === StatutRecours.VALIDE_NIVEAU_2) {
      recours.niveauValidation = 2;
      recours.validateurs.niveau2 = utilisateur;
      recours.validateurs.dateValidationNiveau2 = new Date();
    } else if (nouveauStatut === StatutRecours.RESOLU) {
      recours.dateResolution = new Date();
      recours.tempsTraitement = this.calculerTempsTraitement(recours.dateCreation, new Date());
    }

    this.recoursSubject.next([...this.mockRecours]);
    return of(recours);
  }

  ajouterCommentaire(id: string, contenu: string, auteur: string, type: 'INTERNE' | 'CLIENT' = 'INTERNE', fichiers?: Fichier[]): Observable<CommentaireRecours> {
    const recours = this.mockRecours.find(r => r.id === id);
    if (!recours) {
      throw new Error('Recours non trouvé');
    }

    const commentaire: CommentaireRecours = {
      id: this.generateId(),
      auteur: auteur,
      contenu: contenu,
      dateCreation: new Date(),
      type: type,
      fichiers: fichiers
    };

    recours.commentaires.push(commentaire);
    recours.dateModification = new Date();
    
    this.recoursSubject.next([...this.mockRecours]);
    return of(commentaire);
  }

  assignerRecours(id: string, assigneA: string, assignePar: string): Observable<Recours> {
    const recours = this.mockRecours.find(r => r.id === id);
    if (!recours) {
      throw new Error('Recours non trouvé');
    }

    const action: ActionRecours = {
      id: this.generateId(),
      action: `Assignation à ${assigneA}`,
      effectueePar: assignePar,
      dateAction: new Date(),
      statutAvant: recours.statut,
      statutApres: recours.statut
    };

    recours.assigneA = assigneA;
    recours.actions.push(action);
    recours.dateModification = new Date();

    this.recoursSubject.next([...this.mockRecours]);
    return of(recours);
  }

  getStatutOptions(): { value: StatutRecours; label: string; color: string }[] {
    return [
      { value: StatutRecours.BROUILLON, label: 'Brouillon', color: 'gray' },
      { value: StatutRecours.SOUMIS, label: 'Soumis', color: 'blue' },
      { value: StatutRecours.EN_COURS_ANALYSE, label: 'En cours d\'analyse', color: 'yellow' },
      { value: StatutRecours.ATTENTE_INFORMATIONS, label: 'Attente informations', color: 'orange' },
      { value: StatutRecours.EN_COURS_TRAITEMENT, label: 'En cours de traitement', color: 'purple' },
      { value: StatutRecours.VALIDE_NIVEAU_1, label: 'Validé niveau 1', color: 'indigo' },
      { value: StatutRecours.VALIDE_NIVEAU_2, label: 'Validé niveau 2', color: 'green' },
      { value: StatutRecours.REJETE, label: 'Rejeté', color: 'red' },
      { value: StatutRecours.RESOLU, label: 'Résolu', color: 'green' },
      { value: StatutRecours.FERME, label: 'Fermé', color: 'gray' }
    ];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateNumero(): string {
    const year = new Date().getFullYear();
    const count = this.mockRecours.length + 1;
    return `REC-${year}-${count.toString().padStart(3, '0')}`;
  }

  private calculerTempsTraitement(dateDebut: Date, dateFin: Date): number {
    return Math.round((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60)); // en heures
  }

  // Méthodes de compatibilité avec l'ancien système
  getAllRecours(): Observable<Recours[]> {
    return this.getRecours();
  }

  createRecours(recours: Partial<Recours>): Observable<Recours> {
    return this.creerRecours(recours);
  }

  getStatistiques(): Observable<any> {
    return this.getRecours().pipe(
      map((recours: Recours[]) => {
        const stats = {
          total: recours.length,
          nouveaux: recours.filter((r: Recours) => r.statut === StatutRecours.BROUILLON).length,
          enCours: recours.filter((r: Recours) => [StatutRecours.SOUMIS, StatutRecours.EN_COURS_ANALYSE, StatutRecours.EN_COURS_TRAITEMENT].includes(r.statut)).length,
          valides: recours.filter((r: Recours) => [StatutRecours.VALIDE_NIVEAU_1, StatutRecours.VALIDE_NIVEAU_2].includes(r.statut)).length,
          resolus: recours.filter((r: Recours) => r.statut === StatutRecours.RESOLU).length,
          rejetes: recours.filter((r: Recours) => r.statut === StatutRecours.REJETE).length,
          enAttente: recours.filter((r: Recours) => r.statut === StatutRecours.ATTENTE_INFORMATIONS).length,
          fermes: recours.filter((r: Recours) => r.statut === StatutRecours.FERME).length
        };
        return stats;
      })
    );
  }
}
