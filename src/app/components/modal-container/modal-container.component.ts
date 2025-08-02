import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ConfirmModal } from '../../services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let modal of modals" 
         class="fixed inset-0 z-50 overflow-y-auto"
         [attr.aria-labelledby]="'modal-title-' + modal.id"
         [attr.aria-describedby]="'modal-description-' + modal.id"
         role="dialog"
         aria-modal="true">
      <!-- Overlay -->
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
             (click)="closeModal(modal.id, false)"></div>

        <!-- Center modal -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                   [ngClass]="getIconBgClass(modal.type)">
                <svg class="h-6 w-6" [ngClass]="getIconClass(modal.type)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getIconPath(modal.type)"></path>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" [id]="'modal-title-' + modal.id">
                  {{ modal.title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500" [id]="'modal-description-' + modal.id">
                    {{ modal.message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" 
                    (click)="closeModal(modal.id, true)"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    [ngClass]="getConfirmButtonClass(modal.type)">
              {{ modal.confirmText }}
            </button>
            <button type="button" 
                    (click)="closeModal(modal.id, false)"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              {{ modal.cancelText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalContainerComponent implements OnDestroy {
  modals: ConfirmModal[] = [];
  private subscription: Subscription;

  constructor(private modalService: ModalService) {
    this.subscription = this.modalService.modals$.subscribe(
      (modals: ConfirmModal[]) => this.modals = modals
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeModal(id: string, result: boolean): void {
    this.modalService.close(id, result);
  }

  getIconBgClass(type?: string): string {
    switch (type) {
      case 'danger': return 'bg-red-100';
      case 'warning': return 'bg-yellow-100';
      case 'success': return 'bg-green-100';
      case 'info': return 'bg-blue-100';
      default: return 'bg-blue-100';
    }
  }

  getIconClass(type?: string): string {
    switch (type) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      case 'info': return 'text-blue-600';
      default: return 'text-blue-600';
    }
  }

  getConfirmButtonClass(type?: string): string {
    switch (type) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'success': return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'info': return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      default: return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  }

  getIconPath(type?: string): string {
    switch (type) {
      case 'danger': 
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'warning': 
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'success': 
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'info': 
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      default: 
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
}
