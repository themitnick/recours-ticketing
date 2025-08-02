import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmModal {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  resolve: (result: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalsSubject = new BehaviorSubject<ConfirmModal[]>([]);
  public modals$ = this.modalsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  confirm(
    title: string, 
    message: string, 
    options: {
      confirmText?: string;
      cancelText?: string;
      type?: 'danger' | 'warning' | 'info' | 'success';
    } = {}
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const modal: ConfirmModal = {
        id: this.generateId(),
        title,
        message,
        confirmText: options.confirmText || 'Confirmer',
        cancelText: options.cancelText || 'Annuler',
        type: options.type || 'info',
        resolve
      };

      const currentModals = this.modalsSubject.value;
      this.modalsSubject.next([...currentModals, modal]);
    });
  }

  close(id: string, result: boolean): void {
    const currentModals = this.modalsSubject.value;
    const modal = currentModals.find(m => m.id === id);
    
    if (modal) {
      modal.resolve(result);
      this.modalsSubject.next(currentModals.filter(m => m.id !== id));
    }
  }

  closeAll(): void {
    const currentModals = this.modalsSubject.value;
    currentModals.forEach(modal => modal.resolve(false));
    this.modalsSubject.next([]);
  }
}
