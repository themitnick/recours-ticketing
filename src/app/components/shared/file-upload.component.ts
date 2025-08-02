import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../services/file.service';
import { Fichier } from '../../models/recours.model';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="file-upload-zone">
      <!-- Zone de drop -->
      <div class="drop-zone" 
           [class.dragover]="isDragOver"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)"
           (click)="fileInput.click()">
        <div class="drop-zone-content">
          <svg class="drop-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p class="drop-text">
            <span class="drop-main">Cliquez pour sélectionner</span> ou glissez vos fichiers ici
          </p>
          <p class="drop-hint">PDF, Word, Excel, Images (max 10MB)</p>
        </div>
        
        <input #fileInput 
               type="file" 
               multiple 
               class="hidden"
               [accept]="acceptedTypes"
               (change)="onFileSelected($event)">
      </div>

      <!-- Messages d'erreur -->
      @if (errorMessage) {
        <div class="error-message">
          <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ errorMessage }}
        </div>
      }

      <!-- Liste des fichiers uploadés -->
      @if (uploadedFiles.length > 0) {
        <div class="uploaded-files">
          <h4 class="files-title">Fichiers ajoutés ({{ uploadedFiles.length }})</h4>
          <div class="files-list">
            @for (file of uploadedFiles; track file.id) {
              <div class="file-item">
                <div class="file-info">
                  <svg class="file-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          [attr.d]="getFileIcon(file.type)"></path>
                  </svg>
                  <div class="file-details">
                    <span class="file-name">{{ file.nom }}</span>
                    <span class="file-size">{{ formatFileSize(file.taille) }}</span>
                  </div>
                </div>
                <button class="remove-btn" (click)="removeFile(file)" title="Supprimer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .file-upload-zone {
      @apply space-y-4;
    }

    .drop-zone {
      @apply border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all duration-200;
      @apply hover:border-primary-400 hover:bg-primary-50;
    }

    .drop-zone.dragover {
      @apply border-primary-500 bg-primary-100;
    }

    .drop-zone-content {
      @apply space-y-3;
    }

    .drop-icon {
      @apply w-12 h-12 mx-auto text-gray-400;
    }

    .drop-text {
      @apply text-gray-600;
    }

    .drop-main {
      @apply font-semibold text-primary-600 hover:text-primary-700;
    }

    .drop-hint {
      @apply text-sm text-gray-500;
    }

    .error-message {
      @apply flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700;
    }

    .error-icon {
      @apply w-5 h-5 text-red-500 flex-shrink-0;
    }

    .uploaded-files {
      @apply space-y-3;
    }

    .files-title {
      @apply text-sm font-semibold text-gray-900;
    }

    .files-list {
      @apply space-y-2;
    }

    .file-item {
      @apply flex items-center justify-between p-3 bg-gray-50 rounded-lg border;
    }

    .file-info {
      @apply flex items-center space-x-3;
    }

    .file-icon {
      @apply w-6 h-6 text-gray-500;
    }

    .file-details {
      @apply flex flex-col;
    }

    .file-name {
      @apply text-sm font-medium text-gray-900;
    }

    .file-size {
      @apply text-xs text-gray-500;
    }

    .remove-btn {
      @apply p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors;
    }

    .hidden {
      display: none;
    }
  `]
})
export class FileUploadComponent implements OnInit {
  @Input() uploadedBy: string = '';
  @Input() multiple: boolean = true;
  @Input() maxFiles: number = 5;
  @Output() filesUploaded = new EventEmitter<Fichier[]>();

  uploadedFiles: Fichier[] = [];
  isDragOver = false;
  errorMessage = '';
  acceptedTypes = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt';

  constructor(private fileService: FileService) {}

  ngOnInit(): void {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []);
    this.processFiles(files);
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files || []) as File[];
    this.processFiles(files);
    
    // Reset input
    event.target.value = '';
  }

  private processFiles(files: File[]): void {
    this.errorMessage = '';

    // Vérifier le nombre de fichiers
    if (!this.multiple && files.length > 1) {
      this.errorMessage = 'Un seul fichier autorisé';
      return;
    }

    if (this.uploadedFiles.length + files.length > this.maxFiles) {
      this.errorMessage = `Maximum ${this.maxFiles} fichiers autorisés`;
      return;
    }

    files.forEach(file => {
      const validation = this.fileService.validateFile(file);
      if (!validation.valid) {
        this.errorMessage = validation.error || 'Fichier invalide';
        return;
      }

      this.fileService.uploadFile(file, this.uploadedBy).subscribe({
        next: (fichier) => {
          this.uploadedFiles.push(fichier);
          this.filesUploaded.emit(this.uploadedFiles);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du téléchargement';
          console.error('Upload error:', error);
        }
      });
    });
  }

  removeFile(fichier: Fichier): void {
    const index = this.uploadedFiles.findIndex(f => f.id === fichier.id);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
      this.filesUploaded.emit(this.uploadedFiles);
      
      // Optionnel: supprimer du serveur
      this.fileService.deleteFile(fichier.id).subscribe();
    }
  }

  getFileIcon(type: string): string {
    return this.fileService.getFileIcon(type);
  }

  formatFileSize(bytes: number): string {
    return this.fileService.formatFileSize(bytes);
  }
}
