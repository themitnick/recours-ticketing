import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Fichier } from '../models/recours.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private maxFileSize = 10 * 1024 * 1024; // 10MB
  private allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  constructor() { }

  validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.maxFileSize) {
      return { valid: false, error: 'Le fichier est trop volumineux (max 10MB)' };
    }

    if (!this.allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Type de fichier non autorisé' };
    }

    return { valid: true };
  }

  uploadFile(file: File, uploadedBy: string): Observable<Fichier> {
    // Simulation d'upload - en réalité, ceci ferait un appel HTTP
    const fichier: Fichier = {
      id: this.generateId(),
      nom: file.name,
      taille: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // Simulation - en réalité ce serait une URL serveur
      dateUpload: new Date(),
      uploadePar: uploadedBy
    };

    return of(fichier);
  }

  downloadFile(fichier: Fichier): void {
    if (fichier.url) {
      const link = document.createElement('a');
      link.href = fichier.url;
      link.download = fichier.nom;
      link.click();
    }
  }

  deleteFile(fileId: string): Observable<boolean> {
    // Simulation de suppression
    return of(true);
  }

  getFileIcon(type: string): string {
    if (type.startsWith('image/')) {
      return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
    } else if (type === 'application/pdf') {
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    } else if (type.includes('word')) {
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    } else if (type.includes('excel') || type.includes('sheet')) {
      return 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z';
    } else {
      return 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
