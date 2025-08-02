import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';
import { RecoursService } from '../../services/recours.service';
import { TicketService } from '../../services/ticket.service';
import { User, UserRole } from '../../models';
import { Recours } from '../../models/recours.model';
import { Ticket } from '../../models';

interface TraitementRecours {
  id: number;
  numero: string;
  typeRecours: string;
  statut: string;
  priorite: string;
  description: string;
  montantConteste: number;
  demandeur: string;
  dateCreation: Date;
  delaiReponse: Date;
  assigneA: string;
  etapesTraitement: EtapeTraitement[];
  fichiers: any[];
  commentaires: Commentaire[];
  validation?: ValidationNiveau;
  // Propriétés pour la vérification des droits d'accès
  clientEmail?: string;
  requrantEmail?: string;
  demandeurEmail?: string;
}

interface EtapeTraitement {
  id: number;
  nom: string;
  description: string;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE' | 'BLOQUE';
  assigneA: string;
  dateDebut?: Date;
  dateFin?: Date;
  commentaire?: string;
  obligatoire: boolean;
}

interface ValidationNiveau {
  niveau1: {
    requis: boolean;
    validePar?: string;
    dateValidation?: Date;
    commentaire?: string;
    statut: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  };
  niveau2: {
    requis: boolean;
    validePar?: string;
    dateValidation?: Date;
    commentaire?: string;
    statut: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  };
}

interface Commentaire {
  id: number;
  auteur: string;
  contenu: string;
  date: Date;
  type: 'COMMENTAIRE' | 'DECISION' | 'ESCALADE';
}

@Component({
  selector: 'app-traitement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="traitement-container" *ngIf="item">
      <!-- Bouton retour -->
      <div class="mb-4">
        <button (click)="retourAuDetail()" class="text-primary-600 hover:text-primary-700 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          ← Retour au détail de la demande
        </button>
      </div>

      <!-- En-tête -->
      <div class="mb-8">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              🔧 Traitement {{ isRecours ? 'Recours' : 'Ticket' }} #{{ item.numero }}
            </h1>
            <p class="text-gray-600 mt-2">{{ item.description }}</p>
            
            <!-- Badge de rôle utilisateur -->
            <div class="mt-3" *ngIf="currentUser">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [ngClass]="getRoleBadgeClass(currentUser.role)">
                {{ getRoleLabel(currentUser.role) }}
              </span>
              
              <!-- Permissions info -->
              <div class="mt-2 flex flex-wrap gap-2">
                <span *ngIf="canValidateNiveau1" class="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Validation N1
                </span>
                <span *ngIf="canValidateNiveau2" class="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Validation N2
                </span>
                <span *ngIf="canAssignToOthers" class="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  Réassignation
                </span>
                <span *ngIf="canCloseRecours" class="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Fermeture
                </span>
              </div>
            </div>
          </div>
          <div class="flex space-x-3">
            <button (click)="exportPDF()" class="btn btn-secondary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Exporter PDF
            </button>
            <button (click)="goBack()" class="btn btn-secondary">Retour</button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Colonne principale -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Informations générales -->
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Statut</label>
                <select [(ngModel)]="item.statut" 
                        (change)="onStatutChange()" 
                        [disabled]="!canModifyStatus()"
                        class="form-input">
                  <option value="NOUVEAU">Nouveau</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="EN_ATTENTE_VALIDATION">En attente validation</option>
                  <option value="VALIDE">Validé</option>
                  <option value="REJETE">Rejeté</option>
                  <option value="RESOLU">Résolu</option>
                  <option value="ANNULE">Annulé</option>
                  <option value="FERME">Fermé</option>
                </select>
              </div>
              <div>
                <label class="form-label">Priorité</label>
                <select [(ngModel)]="item.priorite" class="form-input">
                  <option value="BASSE">Basse</option>
                  <option value="NORMALE">Normale</option>
                  <option value="HAUTE">Haute</option>
                  <option value="CRITIQUE">Critique</option>
                </select>
              </div>
              <div>
                <label class="form-label">Assigné à</label>
                <select [(ngModel)]="item.assigneA" class="form-input">
                  <option value="">Sélectionner un agent</option>
                  <option *ngFor="let agent of agents" [value]="agent.email">{{ agent.nom }}</option>
                </select>
              </div>
              <div>
                <label class="form-label">Date limite</label>
                <input type="datetime-local" [(ngModel)]="delaiReponseString" class="form-input">
              </div>
            </div>
            
            <div class="mt-4" *ngIf="isRecours">
              <label class="form-label">Montant contesté (FCFA)</label>
              <input type="number" [(ngModel)]="item.montantConteste" class="form-input" min="0">
            </div>
          </div>

          <!-- Section de Décision Superviseur -->
          <div class="card p-6" *ngIf="showDecisionSuperviseur()">>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Décision Superviseur</h2>
              <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                {{ isRecours ? 'Recours' : 'Ticket' }} en attente de traitement
              </span>
            </div>
            
            <!-- Actions principales -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <button (click)="preparerDecision('VALIDER')" 
                      class="btn btn-success flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Valider
              </button>
              
              <button (click)="preparerDecision('REJETER')" 
                      class="btn btn-danger flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Rejeter
              </button>
              
              <button (click)="preparerDecision('COMPLEMENT')" 
                      class="btn btn-warning flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Demander complément
              </button>
              
              <button (click)="preparerDecision('ANNULER')" 
                      class="btn btn-gray flex items-center justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364L18.364 5.636"></path>
                </svg>
                Annuler
              </button>
            </div>
            
            <!-- Formulaire de décision -->
            <div *ngIf="showDecisionSection" class="border rounded-lg p-4 bg-gray-50">
              <h3 class="font-medium text-gray-900 mb-3">
                {{ getDecisionTitle() }}
              </h3>
              
              <!-- Validation -->
              <div *ngIf="decisionSuperviseur === 'VALIDER'" class="space-y-4">
                <div>
                  <label class="form-label">Commentaire de validation (optionnel)</label>
                  <textarea [(ngModel)]="commentaireValidation1" 
                            placeholder="Ajouter un commentaire sur la validation..."
                            class="form-input" rows="3"></textarea>
                </div>
                
                <div class="flex space-x-3">
                  <button (click)="confirmerDecision()" class="btn btn-success">
                    Confirmer la validation
                  </button>
                  <button (click)="annulerDecision()" class="btn btn-secondary">
                    Annuler
                  </button>
                </div>
              </div>
              
              <!-- Rejet -->
              <div *ngIf="decisionSuperviseur === 'REJETER'" class="space-y-4">
                <div>
                  <label class="form-label">Motif du rejet <span class="text-red-500">*</span></label>
                  <textarea [(ngModel)]="explicationRejet" 
                            placeholder="Expliquez clairement les raisons du rejet..."
                            class="form-input" rows="4" required></textarea>
                </div>
                
                <div class="flex space-x-3">
                  <button (click)="confirmerDecision()" 
                          [disabled]="!explicationRejet.trim()"
                          class="btn btn-danger">
                    Confirmer le rejet
                  </button>
                  <button (click)="annulerDecision()" class="btn btn-secondary">
                    Annuler
                  </button>
                </div>
              </div>
              
              <!-- Demande de complément -->
              <div *ngIf="decisionSuperviseur === 'COMPLEMENT'" class="space-y-4">
                <div>
                  <label class="form-label">Éléments manquants <span class="text-red-500">*</span></label>
                  <textarea [(ngModel)]="complementDemande" 
                            placeholder="Précisez quels documents ou informations sont nécessaires..."
                            class="form-input" rows="4" required></textarea>
                </div>
                
                <div class="flex space-x-3">
                  <button (click)="confirmerDecision()" 
                          [disabled]="!complementDemande.trim()"
                          class="btn btn-warning">
                    Demander le complément
                  </button>
                  <button (click)="annulerDecision()" class="btn btn-secondary">
                    Annuler
                  </button>
                </div>
              </div>
              
              <!-- Annulation -->
              <div *ngIf="decisionSuperviseur === 'ANNULER'" class="space-y-4">
                <div>
                  <label class="form-label">Motif d'annulation <span class="text-red-500">*</span></label>
                  <textarea [(ngModel)]="explicationAnnulation" 
                            placeholder="Expliquez les raisons de l'annulation..."
                            class="form-input" rows="4" required></textarea>
                </div>
                
                <div class="flex space-x-3">
                  <button (click)="confirmerDecision()" 
                          [disabled]="!explicationAnnulation.trim()"
                          class="btn btn-gray">
                    Confirmer l'annulation
                  </button>
                  <button (click)="annulerDecision()" class="btn btn-secondary">
                    Annuler
                  </button>
                </div>
              </div>
              
              <!-- Upload de fichiers justificatifs -->
              <div class="mt-4 pt-4 border-t">
                <label class="form-label">Fichiers justificatifs (optionnel)</label>
                <div class="mt-2">
                  <input type="file" 
                         (change)="onFileSelect($event)" 
                         multiple 
                         accept=".pdf,.doc,.docx,.jpg,.png"
                         class="form-input">
                  <p class="text-sm text-gray-500 mt-1">
                    Formats acceptés : PDF, DOC, DOCX, JPG, PNG (Max 5MB par fichier)
                  </p>
                </div>
                
                <!-- Liste des fichiers sélectionnés -->
                <div *ngIf="fichiersJustificatifs.length > 0" class="mt-3">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Fichiers sélectionnés :</h4>
                  <div class="space-y-2">
                    <div *ngFor="let fichier of fichiersJustificatifs; let i = index" 
                         class="flex items-center justify-between p-2 bg-white rounded border">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span class="text-sm">{{ fichier.name }} ({{ formatFileSize(fichier.size) }})</span>
                      </div>
                      <button (click)="retirerFichier(i)" 
                              class="text-red-500 hover:text-red-700 text-sm">
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étapes de traitement -->
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Étapes de traitement</h2>
            <div class="space-y-4">
              <div *ngFor="let etape of item.etapesTraitement; let i = index" 
                   class="border rounded-lg p-4"
                   [ngClass]="getEtapeClass(etape.statut)">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                         [ngClass]="getEtapeIconClass(etape.statut)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              [attr.d]="getEtapeIcon(etape.statut)"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-medium">{{ etape.nom }}</h3>
                      <p class="text-sm text-gray-600">{{ etape.description }}</p>
                    </div>
                  </div>
                  <span class="px-2 py-1 text-xs rounded-full"
                        [ngClass]="getStatutBadgeClass(etape.statut)">
                    {{ getStatutLabel(etape.statut) }}
                  </span>
                </div>
                
                <div class="ml-11 mt-3">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="font-medium">Assigné à:</span> {{ etape.assigneA }}
                    </div>
                    <div *ngIf="etape.dateDebut">
                      <span class="font-medium">Début:</span> {{ etape.dateDebut | date:'short' }}
                    </div>
                    <div *ngIf="etape.dateFin">
                      <span class="font-medium">Fin:</span> {{ etape.dateFin | date:'short' }}
                    </div>
                  </div>
                  
                  <div class="mt-3" *ngIf="etape.statut === 'EN_COURS' || etape.statut === 'EN_ATTENTE'">
                    <div class="flex space-x-2">
                      <button (click)="demarrerEtape(etape)" 
                              *ngIf="etape.statut === 'EN_ATTENTE' && canManageEtape(etape)"
                              class="btn btn-sm btn-primary">
                        Démarrer
                      </button>
                      <button (click)="terminerEtape(etape)" 
                              *ngIf="etape.statut === 'EN_COURS' && canManageEtape(etape)"
                              class="btn btn-sm btn-success">
                        Terminer
                      </button>
                      <button (click)="bloquerEtape(etape)" 
                              *ngIf="etape.statut === 'EN_COURS' && canManageEtape(etape)"
                              class="btn btn-sm btn-warning">
                        Bloquer
                      </button>
                    </div>
                    
                    <!-- Message d'information sur les permissions -->
                    <div *ngIf="!canManageEtape(etape) && (etape.statut === 'EN_COURS' || etape.statut === 'EN_ATTENTE')" 
                         class="mt-2 text-sm text-gray-500">
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Cette étape est assignée à {{ etape.assigneA }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Validation (pour les recours) -->
          <div class="card p-6" *ngIf="isRecours && item.validation">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Validation</h2>
            
            <!-- Niveau 1 -->
            <div class="border rounded-lg p-4 mb-4" *ngIf="item.validation.niveau1.requis">
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-medium">Validation Niveau 1</h3>
                <span class="px-2 py-1 text-xs rounded-full"
                      [ngClass]="getValidationBadgeClass(item.validation.niveau1.statut)">
                  {{ getValidationLabel(item.validation.niveau1.statut) }}
                </span>
              </div>
              
              <div *ngIf="item.validation.niveau1.statut === 'EN_ATTENTE' && canValidateNiveau1" class="space-y-3">
                <textarea [(ngModel)]="commentaireValidation1" 
                          placeholder="Commentaire de validation..."
                          class="form-input" rows="3"></textarea>
                <div class="flex space-x-2">
                  <button (click)="validerNiveau1(true)" class="btn btn-success">Valider</button>
                  <button (click)="validerNiveau1(false)" class="btn btn-danger">Rejeter</button>
                </div>
              </div>
              
              <div *ngIf="item.validation.niveau1.statut === 'EN_ATTENTE' && !canValidateNiveau1" 
                   class="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                Validation niveau 1 requise - Réservée aux superviseurs
              </div>
              
              <div *ngIf="item.validation.niveau1.statut !== 'EN_ATTENTE'" class="text-sm">
                <p><strong>Validé par:</strong> {{ item.validation.niveau1.validePar }}</p>
                <p><strong>Date:</strong> {{ item.validation.niveau1.dateValidation | date:'short' }}</p>
                <p *ngIf="item.validation.niveau1.commentaire"><strong>Commentaire:</strong> {{ item.validation.niveau1.commentaire }}</p>
              </div>
            </div>
            
            <!-- Niveau 2 -->
            <div class="border rounded-lg p-4" *ngIf="item.validation.niveau2.requis">
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-medium">Validation Niveau 2</h3>
                <span class="px-2 py-1 text-xs rounded-full"
                      [ngClass]="getValidationBadgeClass(item.validation.niveau2.statut)">
                  {{ getValidationLabel(item.validation.niveau2.statut) }}
                </span>
              </div>
              
              <div *ngIf="item.validation.niveau2.statut === 'EN_ATTENTE' && item.validation.niveau1.statut === 'VALIDE' && canValidateNiveau2" class="space-y-3">
                <textarea [(ngModel)]="commentaireValidation2" 
                          placeholder="Commentaire de validation niveau 2..."
                          class="form-input" rows="3"></textarea>
                <div class="flex space-x-2">
                  <button (click)="validerNiveau2(true)" class="btn btn-success">Valider</button>
                  <button (click)="validerNiveau2(false)" class="btn btn-danger">Rejeter</button>
                </div>
              </div>
              
              <div *ngIf="item.validation.niveau2.statut === 'EN_ATTENTE' && item.validation.niveau1.statut === 'VALIDE' && !canValidateNiveau2" 
                   class="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                Validation niveau 2 requise - Réservée aux superviseurs et managers
              </div>
              
              <div *ngIf="item.validation.niveau2.statut === 'EN_ATTENTE' && item.validation.niveau1.statut !== 'VALIDE'" 
                   class="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                En attente de la validation niveau 1
              </div>
              
              <div *ngIf="item.validation.niveau2.statut !== 'EN_ATTENTE'" class="text-sm">
                <p><strong>Validé par:</strong> {{ item.validation.niveau2.validePar }}</p>
                <p><strong>Date:</strong> {{ item.validation.niveau2.dateValidation | date:'short' }}</p>
                <p *ngIf="item.validation.niveau2.commentaire"><strong>Commentaire:</strong> {{ item.validation.niveau2.commentaire }}</p>
              </div>
            </div>
          </div>

          <!-- Commentaires et historique -->
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Commentaires et historique</h2>
            
            <!-- Nouveau commentaire -->
            <div class="mb-4">
              <div class="flex space-x-2 mb-2">
                <button (click)="typeCommentaire = 'COMMENTAIRE'" 
                        [ngClass]="typeCommentaire === 'COMMENTAIRE' ? 'btn-primary' : 'btn-secondary'"
                        class="btn btn-sm">Commentaire</button>
                <button (click)="typeCommentaire = 'DECISION'" 
                        [ngClass]="typeCommentaire === 'DECISION' ? 'btn-primary' : 'btn-secondary'"
                        class="btn btn-sm">Décision</button>
                <button (click)="typeCommentaire = 'ESCALADE'" 
                        [ngClass]="typeCommentaire === 'ESCALADE' ? 'btn-primary' : 'btn-secondary'"
                        class="btn btn-sm">Escalade</button>
              </div>
              <textarea [(ngModel)]="nouveauCommentaire" 
                        placeholder="Ajouter un commentaire..."
                        class="form-input mb-2" rows="3"></textarea>
              <button (click)="ajouterCommentaire()" 
                      [disabled]="!nouveauCommentaire.trim()"
                      class="btn btn-primary">
                Ajouter commentaire
              </button>
            </div>
            
            <!-- Liste des commentaires -->
            <div class="space-y-4">
              <div *ngFor="let commentaire of item.commentaires" 
                   class="border-l-4 pl-4"
                   [ngClass]="getCommentaireBorderClass(commentaire.type)">
                <div class="flex justify-between items-start mb-1">
                  <span class="font-medium">{{ commentaire.auteur }}</span>
                  <div class="flex items-center space-x-2">
                    <span class="px-2 py-1 text-xs rounded-full"
                          [ngClass]="getCommentaireTypeClass(commentaire.type)">
                      {{ commentaire.type }}
                    </span>
                    <span class="text-sm text-gray-500">{{ commentaire.date | date:'short' }}</span>
                  </div>
                </div>
                <p class="text-gray-700">{{ commentaire.contenu }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne latérale -->
        <div class="space-y-6">
          <!-- Informations rapides -->
          <div class="card p-4">
            <h3 class="font-medium text-gray-900 mb-3">Informations rapides</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Créé le:</span>
                <span>{{ item.dateCreation | date:'short' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Demandeur:</span>
                <span>{{ item.demandeur }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span>{{ item.typeRecours }}</span>
              </div>
              <div class="flex justify-between" *ngIf="isRecours">
                <span class="text-gray-600">Montant:</span>
                <span>{{ item.montantConteste | currency:'FCFA':'symbol':'1.0-0' }}</span>
              </div>
            </div>
          </div>

          <!-- Fichiers joints -->
          <div class="card p-4">
            <h3 class="font-medium text-gray-900 mb-3">Fichiers joints</h3>
            <div class="space-y-2">
              <div *ngFor="let fichier of item.fichiers" 
                   class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="text-sm">{{ fichier.nom }}</span>
                </div>
                <button (click)="telechargerFichier(fichier)" class="text-primary-600 hover:text-primary-900 text-sm">
                  Télécharger
                </button>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="card p-4">
            <h3 class="font-medium text-gray-900 mb-3">Actions rapides</h3>
            <div class="space-y-2">
              
              <button (click)="escalader()" 
                      class="btn btn-warning w-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
                Escalader
              </button>
              
              <button (click)="reassigner()" 
                      class="btn btn-secondary w-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                Réassigner
              </button>
              
              <button (click)="suspendre()" 
                      class="btn btn-gray w-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Suspendre
              </button>
              
              <button (click)="fermer()" 
                      class="btn btn-danger w-full">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton de sauvegarde flottant -->
      <div class="fixed bottom-6 right-6">
        <button (click)="sauvegarder()" class="btn btn-primary btn-lg shadow-lg">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Sauvegarder
        </button>
      </div>
    </div>
  `,
  styles: [`
    .btn-lg {
      @apply px-6 py-3 text-base;
    }
  `]
})
export class TraitementComponent implements OnInit {
  item: TraitementRecours | null = null;
  isRecours = true;
  typeCommentaire: 'COMMENTAIRE' | 'DECISION' | 'ESCALADE' = 'COMMENTAIRE';
  nouveauCommentaire = '';
  commentaireValidation1 = '';
  commentaireValidation2 = '';
  delaiReponseString = '';
  currentUser: User | null = null;
  
  // Permissions basées sur le rôle
  canValidateNiveau1 = false;
  canValidateNiveau2 = false;
  canAssignToOthers = false;
  canCloseRecours = false;
  canEscalade = false;

  // Nouvelles propriétés pour le traitement superviseur
  decisionSuperviseur = '';
  explicationRejet = '';
  explicationAnnulation = '';
  complementDemande = '';
  fichiersJustificatifs: File[] = [];
  showDecisionSection = false;

  agents = [
    { nom: 'Jean Kouassi', email: 'jean.kouassi@anare-ci.org' },
    { nom: 'Marie Dupont', email: 'marie.dupont@anare-ci.org' },
    { nom: 'Paul Martin', email: 'paul.martin@anare-ci.org' },
    { nom: 'Superviseur Recours', email: 'superviseur.recours@anare-ci.org' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private modalService: ModalService,
    private authService: AuthService,
    private recoursService: RecoursService,
    private ticketService: TicketService
  ) {}

  retourAuDetail(): void {
    if (this.item) {
      if (this.isRecours) {
        this.router.navigate(['/recours', this.item.id]);
      } else {
        this.router.navigate(['/tickets', this.item.id]);
      }
    }
  }

  ngOnInit(): void {
    console.log('=== DEBUT ngOnInit ===');
    
    // Récupérer l'utilisateur actuel
    this.currentUser = this.authService.getCurrentUser();
    console.log('Utilisateur récupéré:', this.currentUser);
    
    // Vérifier qu'un utilisateur est connecté
    if (!this.currentUser) {
      console.error('Aucun utilisateur connecté, redirection vers login');
      this.router.navigate(['/login']);
      return;
    }
    
    this.route.params.subscribe(params => {
      const id = params['id'];
      
      // Détecter le type à partir de l'URL complète
      const fullUrl = this.router.url;
      console.log('URL complète:', fullUrl);
      
      // Si l'URL contient '/recours/', c'est un recours, sinon c'est un ticket
      this.isRecours = fullUrl.includes('/recours/');
      
      console.log('Route params:', { id, fullUrl, isRecours: this.isRecours });
      
      // Définir les permissions après avoir déterminé le type
      this.setPermissions();
      
      this.loadItem(id);
      
      console.log('=== FIN ngOnInit ===');
    });
  }

  private setPermissions(): void {
    if (!this.currentUser) {
      console.warn('Aucun utilisateur pour définir les permissions');
      return;
    }

    const role = this.currentUser.role;
    console.log('Utilisateur connecté:', this.currentUser.nom, this.currentUser.prenom, '- Rôle:', role);
    
    // Permissions basées sur le rôle
    switch (role) {
      case UserRole.SUPERVISEUR_RECOURS:
        // Superviseur recours : seulement les recours
        this.canValidateNiveau1 = this.isRecours;
        this.canValidateNiveau2 = this.isRecours;
        this.canAssignToOthers = this.isRecours;
        this.canCloseRecours = this.isRecours;
        this.canEscalade = true;
        console.log('✅ Permissions SUPERVISEUR RECOURS accordées pour:', this.isRecours ? 'Recours' : 'Tickets');
        break;
        
      case UserRole.SUPERVISEUR_IT:
        // Superviseur IT : seulement les tickets
        this.canValidateNiveau1 = !this.isRecours;
        this.canValidateNiveau2 = !this.isRecours;
        this.canAssignToOthers = !this.isRecours;
        this.canCloseRecours = !this.isRecours;
        this.canEscalade = true;
        console.log('✅ Permissions SUPERVISEUR IT accordées pour:', this.isRecours ? 'Recours' : 'Tickets');
        break;
        
      case UserRole.ADMIN:
        // Admin : tous les types
        this.canValidateNiveau1 = true;
        this.canValidateNiveau2 = true;
        this.canAssignToOthers = true;
        this.canCloseRecours = true;
        this.canEscalade = true;
        console.log('✅ Permissions ADMIN accordées (tous types)');
        break;
        
      case UserRole.AGENT_RECOURS:
      case UserRole.TECHNICIEN_IT:
        this.canValidateNiveau1 = false;
        this.canValidateNiveau2 = false;
        this.canAssignToOthers = false;
        this.canCloseRecours = false;
        this.canEscalade = true;
        console.log('⚠️ Permissions AGENT accordées (limitées)');
        break;
        
      case UserRole.UTILISATEUR:
      default:
        console.log('❌ Aucune permission accordée (Utilisateur standard)');
        break;
    }
    
    console.log('Permissions définies:', {
      canValidateNiveau1: this.canValidateNiveau1,
      canValidateNiveau2: this.canValidateNiveau2,
      canAssignToOthers: this.canAssignToOthers,
      canCloseRecours: this.canCloseRecours,
      canEscalade: this.canEscalade,
      typeDocument: this.isRecours ? 'Recours' : 'Ticket'
    });
  }

  loadItem(id: string): void {
    console.log('Chargement de l\'item avec ID:', id, 'Type:', this.isRecours ? 'Recours' : 'Ticket');
    
    if (this.isRecours) {
      this.recoursService.getRecoursById(id).subscribe({
        next: (recours) => {
          if (recours) {
            // Vérifier les droits d'accès
            if (this.canAccessItem(recours)) {
              this.item = this.convertRecoursToTraitementRecours(recours);
              this.delaiReponseString = this.formatDateForInput(this.item.delaiReponse);
              console.log('Recours chargé avec succès:', this.item);
            } else {
              this.toastService.error('Accès refusé', 'Vous n\'avez pas le droit d\'accéder à ce recours');
              this.router.navigate(['/recours']);
            }
          } else {
            this.toastService.error('Recours introuvable', 'Le recours demandé n\'existe pas');
            this.router.navigate(['/recours']);
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement du recours:', error);
          this.toastService.error('Erreur', 'Impossible de charger le recours');
          this.router.navigate(['/recours']);
        }
      });
    } else {
      this.ticketService.getTicketById(id).subscribe({
        next: (ticket) => {
          if (ticket) {
            // Vérifier les droits d'accès
            if (this.canAccessItem(ticket)) {
              this.item = this.convertTicketToTraitementRecours(ticket);
              this.delaiReponseString = this.formatDateForInput(this.item.delaiReponse);
              console.log('Ticket chargé avec succès:', this.item);
            } else {
              this.toastService.error('Accès refusé', 'Vous n\'avez pas le droit d\'accéder à ce ticket');
              this.router.navigate(['/tickets']);
            }
          } else {
            this.toastService.error('Ticket introuvable', 'Le ticket demandé n\'existe pas');
            this.router.navigate(['/tickets']);
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement du ticket:', error);
          this.toastService.error('Erreur', 'Impossible de charger le ticket');
          this.router.navigate(['/tickets']);
        }
      });
    }
  }

  // Méthode pour vérifier si l'utilisateur peut accéder à la demande
  private canAccessItem(item: Recours | Ticket): boolean {
    if (!this.currentUser) {
      console.log('❌ Accès refusé : aucun utilisateur connecté');
      return false;
    }

    const userEmail = this.currentUser.email;
    const userRole = this.currentUser.role;

    console.log('🔍 Vérification d\'accès:', {
      userEmail,
      userRole,
      itemType: this.isRecours ? 'Recours' : 'Ticket',
      itemId: item.id
    });

    // Admins peuvent tout voir
    if (userRole === UserRole.ADMIN) {
      console.log('✅ Accès autorisé : Admin');
      return true;
    }

    // Superviseurs peuvent voir toutes les demandes de leur domaine
    if (userRole === UserRole.SUPERVISEUR_RECOURS && this.isRecours) {
      console.log('✅ Accès autorisé : Superviseur Recours');
      return true;
    }
    
    if (userRole === UserRole.SUPERVISEUR_IT && !this.isRecours) {
      console.log('✅ Accès autorisé : Superviseur IT');
      return true;
    }

    // Agents/Techniciens peuvent voir les demandes qui leur sont assignées
    if ((userRole === UserRole.AGENT_RECOURS || userRole === UserRole.TECHNICIEN_IT) && 
        'assigneA' in item && item.assigneA === userEmail) {
      console.log('✅ Accès autorisé : Agent/Technicien assigné à cette demande');
      return true;
    }

    // Utilisateurs standards : SEULEMENT les demandes qu'ils ont créées
    if (userRole === UserRole.UTILISATEUR) {
      console.log('🔒 Utilisateur standard - Vérification de propriété');
      
      // Vérifier si l'utilisateur est le créateur/demandeur de la demande
      if ('clientEmail' in item && item.clientEmail === userEmail) {
        console.log('✅ Accès autorisé : Créateur de la demande (clientEmail)', { itemClientEmail: item.clientEmail, userEmail });
        return true;
      }
      
      if ('requrantEmail' in item && item.requrantEmail === userEmail) {
        console.log('✅ Accès autorisé : Créateur de la demande (requrantEmail)', { itemRequrantEmail: item.requrantEmail, userEmail });
        return true;
      }
      
      if ('demandeurEmail' in item && item.demandeurEmail === userEmail) {
        console.log('✅ Accès autorisé : Créateur de la demande (demandeurEmail)', { itemDemandeurEmail: item.demandeurEmail, userEmail });
        return true;
      }

      console.log('❌ Accès refusé pour utilisateur standard - Pas le créateur de la demande:', {
        userEmail,
        itemEmails: {
          clientEmail: 'clientEmail' in item ? item.clientEmail : 'N/A',
          requrantEmail: 'requrantEmail' in item ? item.requrantEmail : 'N/A',
          demandeurEmail: 'demandeurEmail' in item ? item.demandeurEmail : 'N/A'
        }
      });
      return false;
    }

    console.log('❌ Accès refusé :', {
      userEmail,
      userRole,
      itemType: this.isRecours ? 'Recours' : 'Ticket',
      reason: 'Rôle non autorisé ou conditions non remplies'
    });
    
    return false;
  }

  // Convertir un recours en TraitementRecours
  private convertRecoursToTraitementRecours(recours: Recours): TraitementRecours {
    return {
      id: parseInt(recours.id),
      numero: recours.numero,
      typeRecours: recours.type,
      statut: recours.statut,
      priorite: recours.priorite,
      description: recours.description,
      montantConteste: recours.montantLitige || 0,
      demandeur: recours.clientNom || recours.requrantNom + ' ' + recours.requrantPrenom,
      dateCreation: recours.dateCreation,
      delaiReponse: recours.dateEcheance || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours par défaut
      assigneA: recours.assigneA || '',
      clientEmail: recours.clientEmail,
      requrantEmail: recours.requrantEmail,
      etapesTraitement: this.createDefaultEtapes(),
      fichiers: recours.fichiers || [],
      commentaires: this.convertCommentaires(recours.commentaires || []),
      validation: {
        niveau1: {
          requis: true,
          statut: 'EN_ATTENTE'
        },
        niveau2: {
          requis: true,
          statut: 'EN_ATTENTE'
        }
      }
    };
  }

  // Convertir un ticket en TraitementRecours
  private convertTicketToTraitementRecours(ticket: Ticket): TraitementRecours {
    return {
      id: parseInt(ticket.id),
      numero: ticket.numero,
      typeRecours: ticket.type,
      statut: ticket.statut,
      priorite: ticket.priorite,
      description: ticket.description,
      montantConteste: 0,
      demandeur: ticket.demandeurNom || ticket.demandeur,
      dateCreation: ticket.dateCreation,
      delaiReponse: new Date(ticket.dateCreation.getTime() + (ticket.sla?.tempsResolution || 24) * 60 * 60 * 1000),
      assigneA: '', // Les tickets n'ont pas forcément d'assignation directe
      demandeurEmail: ticket.demandeurEmail,
      etapesTraitement: this.createDefaultEtapes(),
      fichiers: [],
      commentaires: [],
      validation: undefined // Les tickets n'ont pas de validation multi-niveaux
    };
  }

  // Créer des étapes par défaut
  private createDefaultEtapes(): EtapeTraitement[] {
    return [
      {
        id: 1,
        nom: 'Analyse initiale',
        description: 'Analyse et classification de la demande',
        statut: 'TERMINE',
        assigneA: this.currentUser?.email || '',
        dateDebut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        dateFin: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        obligatoire: true
      },
      {
        id: 2,
        nom: 'Investigation',
        description: 'Investigation approfondie',
        statut: 'EN_COURS',
        assigneA: this.currentUser?.email || '',
        dateDebut: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        obligatoire: true
      },
      {
        id: 3,
        nom: 'Validation',
        description: 'Validation par le superviseur',
        statut: 'EN_ATTENTE',
        assigneA: 'superviseur.recours@anare-ci.org',
        obligatoire: true
      }
    ];
  }

  // Convertir les commentaires
  private convertCommentaires(commentaires: any[]): Commentaire[] {
    return commentaires.map(c => ({
      id: c.id || Math.random(),
      auteur: c.auteur || 'Utilisateur',
      contenu: c.contenu || c.message || '',
      date: c.date || new Date(),
      type: c.type || 'COMMENTAIRE'
    }));
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 16);
  }

  onStatutChange(): void {
    if (this.item) {
      console.log('Statut changé:', this.item.statut);
    }
  }

  demarrerEtape(etape: EtapeTraitement): void {
    etape.statut = 'EN_COURS';
    etape.dateDebut = new Date();
    console.log('Étape démarrée:', etape);
  }

  terminerEtape(etape: EtapeTraitement): void {
    etape.statut = 'TERMINE';
    etape.dateFin = new Date();
    console.log('Étape terminée:', etape);
  }

  bloquerEtape(etape: EtapeTraitement): void {
    etape.statut = 'BLOQUE';
    console.log('Étape bloquée:', etape);
  }

  validerNiveau1(valide: boolean): void {
    if (!this.canValidateNiveau1) {
      this.toastService.error('Accès refusé', 'Vous n\'avez pas les permissions pour valider ce niveau');
      return;
    }

    if (this.item?.validation) {
      this.item.validation.niveau1.statut = valide ? 'VALIDE' : 'REJETE';
      this.item.validation.niveau1.validePar = this.currentUser?.nom + ' ' + this.currentUser?.prenom;
      this.item.validation.niveau1.dateValidation = new Date();
      this.item.validation.niveau1.commentaire = this.commentaireValidation1;
      this.commentaireValidation1 = '';
      
      const action = valide ? 'validé' : 'rejeté';
      this.toastService.success('Validation niveau 1', `Le recours a été ${action} au niveau 1`);
      
      // Si rejeté, mettre à jour le statut du recours
      if (!valide && this.item) {
        this.item.statut = 'REJETE';
      }
    }
  }

  validerNiveau2(valide: boolean): void {
    if (!this.canValidateNiveau2) {
      this.toastService.error('Accès refusé', 'Vous n\'avez pas les permissions pour valider ce niveau');
      return;
    }

    if (this.item?.validation) {
      this.item.validation.niveau2.statut = valide ? 'VALIDE' : 'REJETE';
      this.item.validation.niveau2.validePar = this.currentUser?.nom + ' ' + this.currentUser?.prenom;
      this.item.validation.niveau2.dateValidation = new Date();
      this.item.validation.niveau2.commentaire = this.commentaireValidation2;
      this.commentaireValidation2 = '';
      
      const action = valide ? 'validé' : 'rejeté';
      this.toastService.success('Validation niveau 2', `Le recours a été ${action} au niveau 2`);
      
      // Si validé au niveau 2, marquer comme résolu
      if (valide && this.item) {
        this.item.statut = 'RESOLU';
      } else if (!valide && this.item) {
        this.item.statut = 'REJETE';
      }
    }
  }

  ajouterCommentaire(): void {
    if (this.nouveauCommentaire.trim() && this.item) {
      const commentaire: Commentaire = {
        id: this.item.commentaires.length + 1,
        auteur: this.currentUser?.nom + ' ' + this.currentUser?.prenom || 'Utilisateur',
        contenu: this.nouveauCommentaire,
        date: new Date(),
        type: this.typeCommentaire
      };
      this.item.commentaires.push(commentaire);
      this.nouveauCommentaire = '';
      
      this.toastService.success('Commentaire ajouté', 'Votre commentaire a été ajouté avec succès');
    }
  }

  // Nouvelles méthodes de traitement pour superviseurs
  async approuverRecours(): Promise<void> {
    if (!this.canValidateNiveau2) {
      this.toastService.error('Accès refusé', 'Vous n\'avez pas les permissions pour approuver ce recours');
      return;
    }

    const confirmed = await this.modalService.confirm(
      'Approuver le recours',
      'Voulez-vous approuver définitivement ce recours ?',
      { type: 'success', confirmText: 'Approuver', cancelText: 'Annuler' }
    );

    if (confirmed && this.item) {
      this.item.statut = 'VALIDE';
      
      // Ajouter un commentaire d'approbation
      const commentaire: Commentaire = {
        id: this.item.commentaires.length + 1,
        auteur: this.currentUser?.nom + ' ' + this.currentUser?.prenom || 'Superviseur',
        contenu: 'Recours approuvé par le superviseur',
        date: new Date(),
        type: 'DECISION'
      };
      this.item.commentaires.push(commentaire);
      
      this.toastService.success('Recours approuvé', 'Le recours a été approuvé avec succès');
    }
  }

  async rejeterRecours(): Promise<void> {
    if (!this.canValidateNiveau1 && !this.canValidateNiveau2) {
      this.toastService.error('Accès refusé', 'Vous n\'avez pas les permissions pour rejeter ce recours');
      return;
    }

    const confirmed = await this.modalService.confirm(
      'Rejeter le recours',
      'Voulez-vous rejeter définitivement ce recours ?',
      { type: 'danger', confirmText: 'Rejeter', cancelText: 'Annuler' }
    );

    if (confirmed && this.item) {
      this.item.statut = 'REJETE';
      
      // Ajouter un commentaire de rejet
      const commentaire: Commentaire = {
        id: this.item.commentaires.length + 1,
        auteur: this.currentUser?.nom + ' ' + this.currentUser?.prenom || 'Superviseur',
        contenu: 'Recours rejeté par le superviseur',
        date: new Date(),
        type: 'DECISION'
      };
      this.item.commentaires.push(commentaire);
      
      this.toastService.warning('Recours rejeté', 'Le recours a été rejeté');
    }
  }

  async marquerResolu(): Promise<void> {
    if (!this.canCloseRecours) {
      this.toastService.error('Accès refusé', 'Vous n\'avez pas les permissions pour marquer ce recours comme résolu');
      return;
    }

    const confirmed = await this.modalService.confirm(
      'Marquer comme résolu',
      'Voulez-vous marquer ce recours comme résolu ?',
      { type: 'success', confirmText: 'Résolu', cancelText: 'Annuler' }
    );

    if (confirmed && this.item) {
      this.item.statut = 'RESOLU';
      
      // Marquer toutes les étapes comme terminées
      this.item.etapesTraitement.forEach(etape => {
        if (etape.statut !== 'TERMINE') {
          etape.statut = 'TERMINE';
          etape.dateFin = new Date();
        }
      });
      
      // Ajouter un commentaire de résolution
      const commentaire: Commentaire = {
        id: this.item.commentaires.length + 1,
        auteur: this.currentUser?.nom + ' ' + this.currentUser?.prenom || 'Superviseur',
        contenu: 'Recours marqué comme résolu par le superviseur',
        date: new Date(),
        type: 'DECISION'
      };
      this.item.commentaires.push(commentaire);
      
      this.toastService.success('Recours résolu', 'Le recours a été marqué comme résolu');
    }
  }

  async escalader(): Promise<void> {
    if (!this.canEscalade) {
      this.toastService.error('Accès refusé', 'Vous n\'avez pas les permissions pour escalader ce recours');
      return;
    }

    const confirmed = await this.modalService.confirm(
      'Escalader le recours',
      'Voulez-vous escalader ce recours vers un niveau supérieur ?',
      { type: 'warning', confirmText: 'Escalader', cancelText: 'Annuler' }
    );

    if (confirmed && this.item) {
      // Logique d'escalade
      this.item.priorite = 'HAUTE';
      
      // Ajouter un commentaire d'escalade
      const commentaire: Commentaire = {
        id: this.item.commentaires.length + 1,
        auteur: this.currentUser?.nom + ' ' + this.currentUser?.prenom || 'Utilisateur',
        contenu: 'Recours escaladé vers un niveau supérieur',
        date: new Date(),
        type: 'ESCALADE'
      };
      this.item.commentaires.push(commentaire);
      
      this.toastService.info('Recours escaladé', 'Le recours a été escaladé avec succès');
    }
  }

  async reassigner(): Promise<void> {
    if (!this.canAssignToOthers) {
      this.toastService.error('Accès refusé', 'Vous n\'avez pas les permissions pour réassigner ce recours');
      return;
    }

    // Pour l'instant, affichage d'un message - la logique complète serait implémentée avec une modale de sélection d'agent
    this.toastService.info('Réassignation', 'Fonctionnalité de réassignation disponible pour les superviseurs');
  }

  suspendre(): void {
    console.log('Suspension du recours');
    this.toastService.info('En développement', 'Fonctionnalité de suspension en cours de développement...');
  }

  async fermer(): Promise<void> {
    if (!this.canCloseRecours) {
      this.toastService.error('Accès refusé', 'Vous n\'avez pas les permissions pour fermer ce recours');
      return;
    }

    const confirmed = await this.modalService.confirm(
      'Fermer le recours',
      'Êtes-vous sûr de vouloir fermer ce recours ?',
      { type: 'danger', confirmText: 'Fermer', cancelText: 'Annuler' }
    );
    
    if (confirmed && this.item) {
      this.item.statut = 'FERME';
      
      // Ajouter un commentaire de fermeture
      const commentaire: Commentaire = {
        id: this.item.commentaires.length + 1,
        auteur: this.currentUser?.nom + ' ' + this.currentUser?.prenom || 'Superviseur',
        contenu: 'Recours fermé par le superviseur',
        date: new Date(),
        type: 'DECISION'
      };
      this.item.commentaires.push(commentaire);
      
      this.toastService.success('Recours fermé', 'Le recours a été fermé avec succès');
    }
  }

  telechargerFichier(fichier: any): void {
    console.log('Téléchargement du fichier:', fichier);
    this.toastService.info('Téléchargement', 'Téléchargement en cours...');
  }

  exportPDF(): void {
    console.log('Export PDF du recours');
    this.toastService.info('Export PDF', 'Export PDF en cours de développement...');
  }

  sauvegarder(): void {
    if (this.item) {
      console.log('Sauvegarde du recours:', this.item);
      this.toastService.success('Sauvegardé', 'Recours sauvegardé avec succès !');
    }
  }

  goBack(): void {
    this.router.navigate([this.isRecours ? '/recours' : '/tickets']);
  }

  // Méthodes utilitaires pour les classes CSS
  getEtapeClass(statut: string): string {
    switch (statut) {
      case 'TERMINE': return 'bg-green-50 border-green-200';
      case 'EN_COURS': return 'bg-blue-50 border-blue-200';
      case 'BLOQUE': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  }

  getEtapeIconClass(statut: string): string {
    switch (statut) {
      case 'TERMINE': return 'bg-green-100 text-green-600';
      case 'EN_COURS': return 'bg-blue-100 text-blue-600';
      case 'BLOQUE': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  getEtapeIcon(statut: string): string {
    switch (statut) {
      case 'TERMINE': return 'M5 13l4 4L19 7';
      case 'EN_COURS': return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'BLOQUE': return 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364L18.364 5.636';
      default: return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getStatutBadgeClass(statut: string): string {
    switch (statut) {
      case 'TERMINE': return 'bg-green-100 text-green-800';
      case 'EN_COURS': return 'bg-blue-100 text-blue-800';
      case 'BLOQUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      case 'BLOQUE': return 'Bloqué';
      default: return statut;
    }
  }

  getValidationBadgeClass(statut: string): string {
    switch (statut) {
      case 'VALIDE': return 'bg-green-100 text-green-800';
      case 'REJETE': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  }

  getValidationLabel(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente';
      case 'VALIDE': return 'Validé';
      case 'REJETE': return 'Rejeté';
      default: return statut;
    }
  }

  getCommentaireBorderClass(type: string): string {
    switch (type) {
      case 'DECISION': return 'border-blue-400';
      case 'ESCALADE': return 'border-red-400';
      default: return 'border-gray-300';
    }
  }

  getCommentaireTypeClass(type: string): string {
    switch (type) {
      case 'DECISION': return 'bg-blue-100 text-blue-800';
      case 'ESCALADE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'bg-purple-100 text-purple-800';
      case UserRole.SUPERVISEUR_RECOURS: 
      case UserRole.SUPERVISEUR_IT: return 'bg-blue-100 text-blue-800';
      case UserRole.AGENT_RECOURS:
      case UserRole.TECHNICIEN_IT: return 'bg-green-100 text-green-800';
      case UserRole.UTILISATEUR: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN: return 'Administrateur';
      case UserRole.SUPERVISEUR_RECOURS: return 'Superviseur Recours';
      case UserRole.SUPERVISEUR_IT: return 'Superviseur IT';
      case UserRole.AGENT_RECOURS: return 'Agent Recours';
      case UserRole.TECHNICIEN_IT: return 'Technicien IT';
      case UserRole.UTILISATEUR: return 'Utilisateur';
      default: return 'Utilisateur';
    }
  }

  canModifyStatus(): boolean {
    return this.canValidateNiveau1 || this.canValidateNiveau2 || this.canCloseRecours;
  }

  canManageEtape(etape: EtapeTraitement): boolean {
    if (!this.currentUser) return false;
    
    // Les superviseurs peuvent gérer toutes les étapes
    if (this.canValidateNiveau1 || this.canValidateNiveau2) {
      return true;
    }
    
    // Les autres utilisateurs peuvent seulement gérer les étapes qui leur sont assignées
    return etape.assigneA === this.currentUser.email;
  }

  // Méthode pour vérifier si la section décision doit être affichée
  showDecisionSuperviseur(): boolean {
    if (!this.item || !this.currentUser) return false;
    
    // Vérifier les permissions
    const hasPermissions = this.canValidateNiveau1 || this.canValidateNiveau2;
    
    // Vérifier les statuts autorisés
    const allowedStatuses = ['EN_COURS', 'NOUVEAU', 'EN_ATTENTE_VALIDATION'];
    const statusAllowed = allowedStatuses.includes(this.item.statut);
    
    console.log('Debug showDecisionSuperviseur:', {
      hasPermissions,
      statusAllowed,
      currentStatus: this.item.statut,
      userRole: this.currentUser.role,
      isRecours: this.isRecours,
      canValidateNiveau1: this.canValidateNiveau1,
      canValidateNiveau2: this.canValidateNiveau2
    });
    
    return hasPermissions && statusAllowed;
  }

  // Nouvelles méthodes pour le traitement superviseur
  preparerDecision(type: string): void {
    this.decisionSuperviseur = type;
    this.showDecisionSection = true;
    
    // Réinitialiser les champs
    this.commentaireValidation1 = '';
    this.explicationRejet = '';
    this.explicationAnnulation = '';
    this.complementDemande = '';
    this.fichiersJustificatifs = [];
    
    console.log('Préparation décision:', type);
  }

  annulerDecision(): void {
    this.showDecisionSection = false;
    this.decisionSuperviseur = '';
    this.commentaireValidation1 = '';
    this.explicationRejet = '';
    this.explicationAnnulation = '';
    this.complementDemande = '';
    this.fichiersJustificatifs = [];
  }

  async confirmerDecision(): Promise<void> {
    if (!this.item) return;

    let confirmed = false;
    let messageConfirmation = '';
    let typeModal: 'success' | 'danger' | 'warning' | 'info' = 'info';

    switch (this.decisionSuperviseur) {
      case 'VALIDER':
        messageConfirmation = `Voulez-vous valider définitivement ce ${this.isRecours ? 'recours' : 'ticket'} ?`;
        typeModal = 'success';
        break;
      case 'REJETER':
        if (!this.explicationRejet.trim()) {
          this.toastService.error('Motif requis', 'Veuillez indiquer le motif du rejet');
          return;
        }
        messageConfirmation = `Voulez-vous rejeter ce ${this.isRecours ? 'recours' : 'ticket'} ?`;
        typeModal = 'danger';
        break;
      case 'COMPLEMENT':
        if (!this.complementDemande.trim()) {
          this.toastService.error('Précision requise', 'Veuillez préciser les éléments manquants');
          return;
        }
        messageConfirmation = `Voulez-vous demander un complément d'information ?`;
        typeModal = 'warning';
        break;
      case 'ANNULER':
        if (!this.explicationAnnulation.trim()) {
          this.toastService.error('Motif requis', 'Veuillez indiquer le motif d\'annulation');
          return;
        }
        messageConfirmation = `Voulez-vous annuler ce ${this.isRecours ? 'recours' : 'ticket'} ?`;
        typeModal = 'danger';
        break;
    }

    confirmed = await this.modalService.confirm(
      `Confirmer la décision`,
      messageConfirmation,
      { type: typeModal, confirmText: 'Confirmer', cancelText: 'Annuler' }
    );

    if (confirmed) {
      this.executerDecision();
    }
  }

  private executerDecision(): void {
    if (!this.item) return;

    const auteur = `${this.currentUser?.nom} ${this.currentUser?.prenom}` || 'Superviseur';
    
    switch (this.decisionSuperviseur) {
      case 'VALIDER':
        this.item.statut = 'VALIDE';
        this.ajouterCommentaireDecision(
          `${this.isRecours ? 'Recours' : 'Ticket'} validé par le superviseur`,
          this.commentaireValidation1 || `Validation approuvée sans commentaire spécifique`
        );
        this.toastService.success('Validé', `${this.isRecours ? 'Recours' : 'Ticket'} validé avec succès`);
        break;

      case 'REJETER':
        this.item.statut = 'REJETE';
        this.ajouterCommentaireDecision(
          `${this.isRecours ? 'Recours' : 'Ticket'} rejeté par le superviseur`,
          `Motif du rejet : ${this.explicationRejet}`
        );
        this.toastService.warning('Rejeté', `${this.isRecours ? 'Recours' : 'Ticket'} rejeté`);
        break;

      case 'COMPLEMENT':
        this.item.statut = 'EN_ATTENTE_VALIDATION';
        this.ajouterCommentaireDecision(
          `Complément d'information demandé`,
          `Éléments requis : ${this.complementDemande}`
        );
        this.toastService.info('Complément demandé', 'Demande de complément envoyée');
        break;

      case 'ANNULER':
        this.item.statut = 'ANNULE';
        this.ajouterCommentaireDecision(
          `${this.isRecours ? 'Recours' : 'Ticket'} annulé par le superviseur`,
          `Motif d'annulation : ${this.explicationAnnulation}`
        );
        this.toastService.warning('Annulé', `${this.isRecours ? 'Recours' : 'Ticket'} annulé`);
        break;
    }

    // Upload des fichiers justificatifs s'il y en a
    if (this.fichiersJustificatifs.length > 0) {
      this.uploadFichiersJustificatifs();
    }

    // Réinitialiser le formulaire
    this.annulerDecision();
  }

  private ajouterCommentaireDecision(titre: string, contenu: string): void {
    if (!this.item) return;

    const commentaire: Commentaire = {
      id: this.item.commentaires.length + 1,
      auteur: `${this.currentUser?.nom} ${this.currentUser?.prenom}` || 'Superviseur',
      contenu: `${titre}\n\n${contenu}`,
      date: new Date(),
      type: 'DECISION'
    };

    this.item.commentaires.push(commentaire);
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Vérifier la taille (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          this.toastService.error('Fichier trop volumineux', `${file.name} dépasse 5MB`);
          continue;
        }

        // Vérifier le format
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png'
        ];

        if (!allowedTypes.includes(file.type)) {
          this.toastService.error('Format non supporté', `${file.name} n'est pas dans un format accepté`);
          continue;
        }

        this.fichiersJustificatifs.push(file);
      }
    }
  }

  retirerFichier(index: number): void {
    this.fichiersJustificatifs.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private uploadFichiersJustificatifs(): void {
    // Simulation d'upload - en réalité, vous feriez un appel API ici
    this.fichiersJustificatifs.forEach(fichier => {
      if (this.item) {
        this.item.fichiers.push({
          nom: `justificatif_${fichier.name}`,
          url: `/files/justificatifs/${fichier.name}`,
          type: 'justificatif',
          uploadePar: this.currentUser?.email,
          dateUpload: new Date()
        });
      }
    });
    
    this.toastService.success('Fichiers ajoutés', `${this.fichiersJustificatifs.length} fichier(s) justificatif(s) ajouté(s)`);
  }

  getDecisionTitle(): string {
    switch (this.decisionSuperviseur) {
      case 'VALIDER': return `Validation du ${this.isRecours ? 'recours' : 'ticket'}`;
      case 'REJETER': return `Rejet du ${this.isRecours ? 'recours' : 'ticket'}`;
      case 'COMPLEMENT': return `Demande de complément d'information`;
      case 'ANNULER': return `Annulation du ${this.isRecours ? 'recours' : 'ticket'}`;
      default: return 'Décision';
    }
  }
}
