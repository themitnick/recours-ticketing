import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';
import { TypeTicket, PrioriteTicket, Fichier } from '../../../models';
import { FileUploadComponent } from '../../shared/file-upload.component';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent],
  template: `
    <div class="ticket-create">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Créer un nouveau ticket</h1>
      </div>
      
      <div class="card p-6">
        <form (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="form-label">Titre</label>
              <input type="text" [(ngModel)]="formData.titre" name="titre" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Demandeur</label>
              <input type="email" [(ngModel)]="formData.demandeur" name="demandeur" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Type d'incident</label>
              <select [(ngModel)]="formData.typeIncident" name="type" class="form-select" required>
                <option value="">Sélectionner un type</option>
                <option value="PANNE_MATERIEL">Panne matériel</option>
                <option value="PROBLEME_LOGICIEL">Problème logiciel</option>
                <option value="DEMANDE_ACCES">Demande d'accès</option>
                <option value="INSTALLATION">Installation</option>
                <option value="FORMATION">Formation</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Priorité</label>
              <select [(ngModel)]="formData.priorite" name="priorite" class="form-select" required>
                <option value="BASSE">Basse</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="HAUTE">Haute</option>
                <option value="TRES_HAUTE">Très haute</option>
              </select>
            </div>
          </div>
          
          <div class="form-group mt-6">
            <label class="form-label">Description</label>
            <textarea [(ngModel)]="formData.description" name="description" rows="4" class="form-textarea" required></textarea>
          </div>
          
          <!-- Section Upload de fichiers -->
          <div class="form-group mt-6">
            <label class="form-label">Pièces jointes</label>
            <app-file-upload 
              (filesUploaded)="onFilesSelected($event)"
              [maxFiles]="5"
              [multiple]="true">
            </app-file-upload>
            
            <!-- Liste des fichiers sélectionnés -->
            <div *ngIf="fichiers.length > 0" class="mt-4">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Fichiers sélectionnés :</h4>
              <div class="space-y-2">
                <div *ngFor="let fichier of fichiers; let i = index" 
                     class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">{{ fichier.nom }}</span>
                  <button type="button" (click)="removeFile(i)" 
                          class="text-red-600 hover:text-red-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end space-x-4">
            <button type="button" (click)="goBack()" class="btn btn-secondary">Annuler</button>
            <button type="submit" class="btn btn-primary">Créer le ticket</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .ticket-create {
      min-height: calc(100vh - 7rem);
    }
  `]
})
export class TicketCreateComponent {
  formData = {
    titre: '',
    description: '',
    typeIncident: undefined as TypeTicket | undefined,
    priorite: PrioriteTicket.NORMALE,
    demandeur: ''
  };

  fichiers: Fichier[] = [];

  constructor(
    private router: Router,
    private ticketService: TicketService
  ) {}

  onFilesSelected(files: Fichier[]): void {
    this.fichiers = [...this.fichiers, ...files];
  }

  removeFile(index: number): void {
    this.fichiers.splice(index, 1);
  }

  onSubmit(): void {
    const ticketData = {
      ...this.formData,
      fichiers: this.fichiers
    };
    
    this.ticketService.createTicket(ticketData).subscribe(() => {
      this.router.navigate(['/tickets']);
    });
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }
}
