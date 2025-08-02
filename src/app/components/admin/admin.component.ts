import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';

interface SystemConfig {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    delaiRappel: number;
  };
  sla: {
    recours: {
      tempsReponse: number;
      tempsResolution: number;
    };
    tickets: {
      critique: number;
      haute: number;
      normale: number;
      basse: number;
    };
  };
  workflow: {
    validationNiveau1: boolean;
    validationNiveau2: boolean;
    autoAssignation: boolean;
    escaladeAutomatique: boolean;
  };
  securite: {
    sessionTimeout: number;
    motDePasseComplexe: boolean;
    doubleAuthentification: boolean;
    journalisationComplete: boolean;
  };
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-panel">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Administration et Paramètres</h1>
        <p class="text-gray-600 mt-2">Configuration du système ANARE-CI</p>
      </div>

      <!-- Navigation des onglets -->
      <div class="bg-white border-b border-gray-200 mb-8">
        <nav class="-mb-px flex space-x-8">
          <button *ngFor="let tab of tabs" 
                  (click)="activeTab = tab.id"
                  [ngClass]="activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                  class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="tab.icon"></path>
            </svg>
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Onglet Notifications -->
      <div *ngIf="activeTab === 'notifications'" class="space-y-6">
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Configuration des notifications</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Notifications par email</label>
                <p class="text-sm text-gray-500">Envoyer des notifications par email</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="config.notifications.email">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Notifications SMS</label>
                <p class="text-sm text-gray-500">Envoyer des notifications par SMS</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="config.notifications.sms">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Notifications push</label>
                <p class="text-sm text-gray-500">Envoyer des notifications push dans l'application</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="config.notifications.push">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Délai de rappel (heures)</label>
                <input type="number" [(ngModel)]="config.notifications.delaiRappel" class="form-input" min="1" max="72">
              </div>
            </div>
          </div>
        </div>

        <!-- Templates de notifications -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Templates de notifications</h3>
          <div class="space-y-4">
            <div *ngFor="let template of notificationTemplates" class="border rounded p-4">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium">{{ template.name }}</h4>
                <button (click)="editTemplate(template)" class="btn btn-sm btn-secondary">Modifier</button>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ template.description }}</p>
              <div class="bg-gray-50 p-3 rounded text-sm">
                {{ template.preview }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet SLA -->
      <div *ngIf="activeTab === 'sla'" class="space-y-6">
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Configuration SLA Recours</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label">Temps de réponse (heures)</label>
              <input type="number" [(ngModel)]="config.sla.recours.tempsReponse" class="form-input" min="1" max="72">
              <p class="text-sm text-gray-500 mt-1">Délai maximum pour la première réponse</p>
            </div>
            <div>
              <label class="form-label">Temps de résolution (heures)</label>
              <input type="number" [(ngModel)]="config.sla.recours.tempsResolution" class="form-input" min="1" max="168">
              <p class="text-sm text-gray-500 mt-1">Délai maximum pour la résolution complète</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Configuration SLA Tickets</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="form-label">Critique (heures)</label>
              <input type="number" [(ngModel)]="config.sla.tickets.critique" class="form-input" min="1" max="24">
            </div>
            <div>
              <label class="form-label">Haute (heures)</label>
              <input type="number" [(ngModel)]="config.sla.tickets.haute" class="form-input" min="1" max="48">
            </div>
            <div>
              <label class="form-label">Normale (heures)</label>
              <input type="number" [(ngModel)]="config.sla.tickets.normale" class="form-input" min="1" max="72">
            </div>
            <div>
              <label class="form-label">Basse (heures)</label>
              <input type="number" [(ngModel)]="config.sla.tickets.basse" class="form-input" min="1" max="168">
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet Workflow -->
      <div *ngIf="activeTab === 'workflow'" class="space-y-6">
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Configuration du workflow</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Validation niveau 1 obligatoire</label>
                <p class="text-sm text-gray-500">Exiger une validation de niveau 1 pour tous les recours</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="config.workflow.validationNiveau1">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Validation niveau 2 pour montants élevés</label>
                <p class="text-sm text-gray-500">Exiger une validation de niveau 2 pour les montants > 100,000 FCFA</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="config.workflow.validationNiveau2">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Auto-assignation</label>
                <p class="text-sm text-gray-500">Assigner automatiquement selon les règles définies</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="config.workflow.autoAssignation">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Escalade automatique</label>
                <p class="text-sm text-gray-500">Escalader automatiquement en cas de dépassement SLA</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="config.workflow.escaladeAutomatique">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Règles d'assignation -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Règles d'assignation</h3>
          <div class="space-y-4">
            <div *ngFor="let regle of reglesAssignation" class="border rounded p-4">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h4 class="font-medium">{{ regle.nom }}</h4>
                  <p class="text-sm text-gray-600">{{ regle.description }}</p>
                </div>
                <div class="flex space-x-2">
                  <button (click)="editRegle(regle)" class="btn btn-sm btn-secondary">Modifier</button>
                  <button (click)="deleteRegle(regle)" class="btn btn-sm btn-danger">Supprimer</button>
                </div>
              </div>
              <div class="bg-gray-50 p-3 rounded text-sm">
                <strong>Condition:</strong> {{ regle.condition }}<br>
                <strong>Action:</strong> {{ regle.action }}
              </div>
            </div>
            <button (click)="addRegle()" class="btn btn-primary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Ajouter une règle
            </button>
          </div>
        </div>
      </div>

      <!-- Onglet Sécurité -->
      <div *ngIf="activeTab === 'securite'" class="space-y-6">
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Configuration de sécurité</h2>
          
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="form-label">Timeout de session (minutes)</label>
                <input type="number" [(ngModel)]="config.securite.sessionTimeout" class="form-input" min="5" max="480">
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Mot de passe complexe</label>
                <p class="text-sm text-gray-500">Exiger des mots de passe complexes (8+ caractères, maj, min, chiffres, symboles)</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="config.securite.motDePasseComplexe">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Double authentification</label>
                <p class="text-sm text-gray-500">Activer l'authentification à deux facteurs</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="config.securite.doubleAuthentification">
                <span class="toggle-slider"></span>
              </label>
            </div>
            
            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-900">Journalisation complète</label>
                <p class="text-sm text-gray-500">Enregistrer toutes les actions dans les logs</p>
              </div>
              <label class="toggle">
                <input type="checkbox" [(ngModel)]="config.securite.journalisationComplete">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Gestion des utilisateurs -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Gestion des utilisateurs</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière connexion</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let user of users">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-primary-600 font-medium text-sm">{{ user.initiales }}</span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ user.nom }}</div>
                        <div class="text-sm text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [ngClass]="getRoleBadgeClass(user.role)">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [ngClass]="user.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ user.actif ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.derniereConnexion | date:'short' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button (click)="editUser(user)" class="text-primary-600 hover:text-primary-900 mr-3">Modifier</button>
                    <button (click)="toggleUserStatus(user)" 
                            [ngClass]="user.actif ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'">
                      {{ user.actif ? 'Désactiver' : 'Activer' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4">
            <button (click)="addUser()" class="btn btn-primary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Ajouter un utilisateur
            </button>
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end space-x-4 mt-8">
        <button (click)="resetToDefaults()" class="btn btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Valeurs par défaut
        </button>
        <button (click)="saveConfiguration()" class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Sauvegarder
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toggle {
      @apply relative inline-block w-10 h-6;
    }
    
    .toggle input {
      @apply opacity-0 w-0 h-0;
    }
    
    .toggle-slider {
      @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-300;
    }
    
    .toggle-slider:before {
      @apply absolute content-[''] h-4 w-4 left-1 bottom-1 bg-white rounded-full transition-all duration-300;
    }
    
    .toggle input:checked + .toggle-slider {
      @apply bg-primary-600;
    }
    
    .toggle input:checked + .toggle-slider:before {
      @apply transform translate-x-4;
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab = 'notifications';

  tabs = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'M15 17h5l-5 5v-5z M9.857 2.877l-.863-.864A.5.5 0 008.5 2H6a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h8a.5.5 0 00.5-.5V8.5a.5.5 0 00-.146-.354l-4.497-4.269z'
    },
    {
      id: 'sla',
      label: 'SLA',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      id: 'workflow',
      label: 'Workflow',
      icon: 'M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m5 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-5 4v6m0 0l3 3m-3-3l-3 3m3-3V9'
    },
    {
      id: 'securite',
      label: 'Sécurité',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    }
  ];

  config: SystemConfig = {
    notifications: {
      email: true,
      sms: false,
      push: true,
      delaiRappel: 24
    },
    sla: {
      recours: {
        tempsReponse: 4,
        tempsResolution: 48
      },
      tickets: {
        critique: 2,
        haute: 8,
        normale: 24,
        basse: 72
      }
    },
    workflow: {
      validationNiveau1: true,
      validationNiveau2: true,
      autoAssignation: true,
      escaladeAutomatique: true
    },
    securite: {
      sessionTimeout: 30,
      motDePasseComplexe: true,
      doubleAuthentification: false,
      journalisationComplete: true
    }
  };

  notificationTemplates = [
    {
      id: 1,
      name: 'Nouveau recours créé',
      description: 'Notification envoyée lors de la création d\'un recours',
      preview: 'Bonjour {nom}, votre recours #{numero} a été créé et est en cours de traitement...'
    },
    {
      id: 2,
      name: 'Recours résolu',
      description: 'Notification envoyée lors de la résolution d\'un recours',
      preview: 'Votre recours #{numero} a été résolu. Vous pouvez consulter la réponse...'
    },
    {
      id: 3,
      name: 'Ticket assigné',
      description: 'Notification envoyée lors de l\'assignation d\'un ticket',
      preview: 'Le ticket #{numero} vous a été assigné. Priorité: {priorite}...'
    }
  ];

  reglesAssignation = [
    {
      id: 1,
      nom: 'Recours facturation → Agent spécialisé',
      description: 'Assigner automatiquement les recours de facturation',
      condition: 'Type = FACTURATION',
      action: 'Assigner à agent.facturation@anare-ci.org'
    },
    {
      id: 2,
      nom: 'Tickets critiques → Superviseur',
      description: 'Escalader immédiatement les tickets critiques',
      condition: 'Priorité = CRITIQUE',
      action: 'Assigner à superviseur.it@anare-ci.org'
    }
  ];

  users = [
    {
      id: 1,
      nom: 'Admin ANARE',
      email: 'admin@anare-ci.org',
      initiales: 'AA',
      role: 'ADMIN',
      actif: true,
      derniereConnexion: new Date()
    },
    {
      id: 2,
      nom: 'Superviseur Recours',
      email: 'superviseur.recours@anare-ci.org',
      initiales: 'SR',
      role: 'SUPERVISEUR_RECOURS',
      actif: true,
      derniereConnexion: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 3,
      nom: 'Superviseur IT',
      email: 'superviseur.it@anare-ci.org',
      initiales: 'SI',
      role: 'SUPERVISEUR_IT',
      actif: true,
      derniereConnexion: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 4,
      nom: 'Utilisateur Test',
      email: 'utilisateur@anare-ci.org',
      initiales: 'UT',
      role: 'UTILISATEUR',
      actif: false,
      derniereConnexion: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  constructor(
    private toastService: ToastService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadConfiguration();
  }

  loadConfiguration(): void {
    // Dans un vrai projet, charger depuis un service
    console.log('Configuration chargée');
  }

  saveConfiguration(): void {
    console.log('Sauvegarde de la configuration:', this.config);
    this.toastService.success('Configuration sauvegardée', 'La configuration a été sauvegardée avec succès !');
  }

  async resetToDefaults(): Promise<void> {
    const confirmed = await this.modalService.confirm(
      'Restaurer les valeurs par défaut',
      'Êtes-vous sûr de vouloir restaurer les valeurs par défaut ? Cette action est irréversible.',
      { type: 'warning', confirmText: 'Restaurer', cancelText: 'Annuler' }
    );
    
    if (confirmed) {
      // Réinitialiser la configuration
      this.ngOnInit();
      this.toastService.success('Configuration réinitialisée', 'La configuration a été restaurée aux valeurs par défaut !');
    }
  }

  editTemplate(template: any): void {
    console.log('Modification du template:', template);
    this.toastService.info('En développement', 'Edition de template en cours de développement...');
  }

  editRegle(regle: any): void {
    console.log('Modification de la règle:', regle);
    this.toastService.info('En développement', 'Edition de règle en cours de développement...');
  }

  async deleteRegle(regle: any): Promise<void> {
    const confirmed = await this.modalService.confirm(
      'Supprimer la règle',
      'Êtes-vous sûr de vouloir supprimer cette règle ?',
      { type: 'danger', confirmText: 'Supprimer', cancelText: 'Annuler' }
    );
    
    if (confirmed) {
      const index = this.reglesAssignation.indexOf(regle);
      this.reglesAssignation.splice(index, 1);
      this.toastService.success('Règle supprimée', 'La règle a été supprimée avec succès');
    }
  }

  addRegle(): void {
    console.log('Ajout d\'une nouvelle règle');
    this.toastService.info('En développement', 'Ajout de règle en cours de développement...');
  }

  editUser(user: any): void {
    console.log('Modification de l\'utilisateur:', user);
    this.toastService.info('En développement', 'Edition d\'utilisateur en cours de développement...');
  }

  toggleUserStatus(user: any): void {
    user.actif = !user.actif;
    console.log('Statut utilisateur modifié:', user);
    const status = user.actif ? 'activé' : 'désactivé';
    this.toastService.success('Statut modifié', `L'utilisateur a été ${status} avec succès`);
  }

  addUser(): void {
    console.log('Ajout d\'un nouvel utilisateur');
    this.toastService.info('En développement', 'Ajout d\'utilisateur en cours de développement...');
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'SUPERVISEUR_RECOURS':
        return 'bg-blue-100 text-blue-800';
      case 'SUPERVISEUR_IT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
