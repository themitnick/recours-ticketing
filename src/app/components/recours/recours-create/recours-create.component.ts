import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RecoursService } from '../../../services/recours.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { FileUploadComponent } from '../../shared/file-upload.component';
import { TypeRecours, PrioriteRecours, Fichier } from '../../../models/recours.model';

@Component({
  selector: 'app-recours-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FileUploadComponent],
  template: `
    <div class="recours-create max-w-4xl mx-auto">
      <div class="mb-6">
        <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <a [routerLink]="['/recours']" class="hover:text-primary-600">Recours</a>
          <span>/</span>
          <span class="text-gray-900">Nouveau recours</span>
        </nav>
        <h1 class="text-3xl font-bold text-gray-900">Créer un nouveau recours</h1>
        <p class="text-gray-600 mt-2">Remplissez le formulaire ci-dessous pour soumettre votre recours</p>
      </div>
      
      <form (ngSubmit)="onSubmit()" class="space-y-8">
        <!-- Informations générales -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Informations générales
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group md:col-span-2">
              <label class="form-label required">Titre du recours</label>
              <input type="text" 
                     [(ngModel)]="formData.titre" 
                     name="titre" 
                     class="form-input" 
                     placeholder="Décrivez brièvement votre recours..."
                     required>
              <p class="form-help">Soyez précis et concis (ex: "Contestation facture janvier 2025")</p>
            </div>
            
            <div class="form-group">
              <label class="form-label required">Type de recours</label>
              <select [(ngModel)]="formData.type" name="type" class="form-select" required>
                <option value="">Sélectionnez un type</option>
                <option [value]="TypeRecours.FACTURATION">Facturation</option>
                <option [value]="TypeRecours.TECHNIQUE">Technique</option>
                <option [value]="TypeRecours.SERVICE_CLIENT">Service Client</option>
                <option [value]="TypeRecours.COMMERCIAL">Commercial</option>
                <option [value]="TypeRecours.JURIDIQUE">Juridique</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label required">Priorité</label>
              <select [(ngModel)]="formData.priorite" name="priorite" class="form-select" required>
                <option [value]="PrioriteRecours.BASSE">Basse</option>
                <option [value]="PrioriteRecours.NORMALE" selected>Normale</option>
                <option [value]="PrioriteRecours.HAUTE">Haute</option>
                <option [value]="PrioriteRecours.URGENTE">Urgente</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Description détaillée -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Description du problème
          </h2>
          
          <div class="form-group">
            <label class="form-label required">Décrivez votre recours en détail</label>
            <textarea [(ngModel)]="formData.description" 
                      name="description" 
                      rows="6" 
                      class="form-textarea" 
                      placeholder="Expliquez clairement votre problème, les circonstances, les impacts, et ce que vous attendez comme résolution..."
                      required></textarea>
            <div class="flex justify-between items-center mt-2">
              <p class="form-help">Plus votre description est détaillée, plus le traitement sera rapide</p>
              <span class="text-sm text-gray-500">{{ formData.description.length }} caractères</span>
            </div>
          </div>
        </div>

        <!-- Informations de contact -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Informations de contact
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="form-label required">Nom complet</label>
              <input type="text" 
                     [(ngModel)]="formData.clientNom" 
                     name="clientNom" 
                     class="form-input" 
                     readonly>
            </div>
            
            <div class="form-group">
              <label class="form-label required">Email</label>
              <input type="email" 
                     [(ngModel)]="formData.clientEmail" 
                     name="clientEmail" 
                     class="form-input" 
                     readonly>
            </div>
            
            <div class="form-group">
              <label class="form-label">Téléphone</label>
              <input type="tel" 
                     [(ngModel)]="formData.clientTelephone" 
                     name="clientTelephone" 
                     class="form-input" 
                     placeholder="+225 XX XX XX XX XX">
            </div>
          </div>
        </div>

        <!-- Documents joints -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
            </svg>
            Documents justificatifs
          </h2>
          
          <p class="text-gray-600 mb-4">
            Ajoutez tous les documents qui peuvent appuyer votre recours (factures, captures d'écran, correspondances, etc.)
          </p>
          
          <app-file-upload 
            [uploadedBy]="currentUser?.email || 'Utilisateur'"
            [multiple]="true"
            [maxFiles]="10"
            (filesUploaded)="onFilesUploaded($event)">
          </app-file-upload>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button type="button" 
                  (click)="saveDraft()"
                  class="btn btn-secondary flex-1 sm:flex-none">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Sauvegarder brouillon
          </button>
          
          <button type="submit" 
                  class="btn btn-primary flex-1 sm:flex-none"
                  [disabled]="isSubmitting">
            @if (isSubmitting) {
              <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi en cours...
            } @else {
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Soumettre le recours
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .required::after {
      content: ' *';
      @apply text-red-500;
    }
    
    .form-help {
      @apply text-sm text-gray-500 mt-1;
    }
  `]
})
export class RecoursCreateComponent implements OnInit {
  TypeRecours = TypeRecours;
  PrioriteRecours = PrioriteRecours;
  
  currentUser: any = null;
  isSubmitting = false;
  
  formData = {
    titre: '',
    description: '',
    type: TypeRecours.TECHNIQUE,
    priorite: PrioriteRecours.NORMALE,
    clientNom: '',
    clientEmail: '',
    clientTelephone: '',
    fichiers: [] as Fichier[]
  };

  constructor(
    private recoursService: RecoursService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.formData.clientNom = `${user.prenom} ${user.nom}`;
        this.formData.clientEmail = user.email;
        this.formData.clientTelephone = user.telephone || '';
      }
    });
  }

  onFilesUploaded(files: Fichier[]): void {
    this.formData.fichiers = files;
  }

  saveDraft(): void {
    // Implémentation pour sauvegarder en brouillon
    console.log('Sauvegarde brouillon:', this.formData);
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    const recoursData = {
      ...this.formData,
      clientId: this.currentUser?.id
    };

    this.recoursService.creerRecours(recoursData).subscribe({
      next: (recours) => {
        console.log('Recours créé:', recours);
        this.router.navigate(['/recours', recours.id]);
      },
      error: (error) => {
        console.error('Erreur création recours:', error);
        this.isSubmitting = false;
      }
    });
  }

  private validateForm(): boolean {
    if (!this.formData.titre.trim()) {
      this.toastService.error('Erreur de validation', 'Le titre est obligatoire');
      return false;
    }
    
    if (!this.formData.description.trim()) {
      this.toastService.error('Erreur de validation', 'La description est obligatoire');
      return false;
    }
    
    if (this.formData.description.length < 20) {
      this.toastService.error('Erreur de validation', 'La description doit contenir au moins 20 caractères');
      return false;
    }

    return true;
  }
}
