import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div *ngFor="let toast of toasts" 
           class="min-w-80 bg-white rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300"
           [ngClass]="getToastClass(toast.type)">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5" [ngClass]="getIconClass(toast.type)" fill="currentColor" viewBox="0 0 20 20">
              <path [attr.d]="getIconPath(toast.type)"></path>
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium" [ngClass]="getTitleClass(toast.type)">
              {{ toast.title }}
            </p>
            <p class="mt-1 text-sm text-gray-600">
              {{ toast.message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button (click)="removeToast(toast.id)" 
                    class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ToastContainerComponent implements OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription;

  constructor(private toastService: ToastService) {
    this.subscription = this.toastService.toasts$.subscribe(
      (toasts: Toast[]) => this.toasts = toasts
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  getToastClass(type: string): string {
    switch (type) {
      case 'success': return 'border-green-400 bg-green-50';
      case 'error': return 'border-red-400 bg-red-50';
      case 'warning': return 'border-yellow-400 bg-yellow-50';
      case 'info': return 'border-blue-400 bg-blue-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  }

  getTitleClass(type: string): string {
    switch (type) {
      case 'success': return 'text-green-800';
      case 'error': return 'text-red-800';
      case 'warning': return 'text-yellow-800';
      case 'info': return 'text-blue-800';
      default: return 'text-gray-800';
    }
  }

  getIconPath(type: string): string {
    switch (type) {
      case 'success': 
        return 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z';
      case 'error': 
        return 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z';
      case 'warning': 
        return 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z';
      case 'info': 
        return 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z';
      default: 
        return 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z';
    }
  }
}
