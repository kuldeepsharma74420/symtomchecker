import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isVisible" class="modal-overlay" (click)="onCancel()">
      <div class="confirmation-modal glass-card" (click)="$event.stopPropagation()">
        <div class="modal-header mb-3">
          <h5 class="modal-title">{{title}}</h5>
        </div>
        <div class="modal-body mb-4">
          <p class="text-secondary-custom mb-3">{{message}}</p>
          <div *ngIf="userDetails" class="user-details-card">
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">{{userDetails.name}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Username:</span>
              <span class="detail-value">{{userDetails.username}}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Role:</span>
              <span class="detail-value role-badge" [class]="'role-' + userDetails.role?.toLowerCase()">{{userDetails.role}}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex gap-2 justify-content-end">
          <button class="btn btn-outline-secondary" (click)="onCancel()">
            Cancel
          </button>
          <button class="btn btn-danger" (click)="onConfirm()">
            {{confirmText}}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1050;
      backdrop-filter: blur(5px);
    }
    
    .confirmation-modal {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 12px;
      padding: 24px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      animation: modalSlideIn 0.3s ease-out;
    }
    
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .modal-title {
      font-weight: 600;
      color: #333;
      margin: 0;
    }
    
    .modal-body p {
      margin: 0;
      color: #666;
    }
    
    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-outline-secondary {
      background: transparent;
      border: 1px solid #ddd;
      color: #666;
    }
    
    .btn-outline-secondary:hover {
      background: #f8f9fa;
      border-color: #ccc;
    }
    
    .btn-danger {
      background: #dc3545;
      color: white;
    }
    
    .btn-danger:hover {
      background: #c82333;
    }
    
    .user-details-card {
      background: rgba(248, 249, 250, 0.8);
      border-radius: 8px;
      padding: 16px;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .detail-row:last-child {
      margin-bottom: 0;
    }
    
    .detail-label {
      font-weight: 500;
      color: #555;
    }
    
    .detail-value {
      color: #333;
      font-weight: 400;
    }
    
    .role-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 500;
    }
    
    .role-patient {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    .role-doctor {
      background: #e8f5e8;
      color: #388e3c;
    }
    
    .role-admin {
      background: #fff3e0;
      color: #f57c00;
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() isVisible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() userDetails: any = null;
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.isVisible = false;
  }

  onCancel(): void {
    this.cancelled.emit();
    this.isVisible = false;
  }
}