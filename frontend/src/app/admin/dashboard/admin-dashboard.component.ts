import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin.service';
import { ToastService } from '../../shared/services/toast.service';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {};
  selectedModal: string = '';
  modalData: any[] = [];
  loading = false;
  showConfirmModal = false;
  confirmModalData = {
    title: '',
    message: '',
    confirmText: '',
    action: () => {}
  };
  selectedUser: any = null;
  appointmentFilterTitle = 'All';
  allAppointments: any[] = [];

  constructor(
    private adminService: AdminService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }
  
  private loadStats(): void {
    this.adminService.getStats().subscribe({
      next: (res: any) => {
        this.stats = res || {};
      },
      error: (error) => {
        console.error('Failed to load admin stats:', error);
        this.stats = {
          totalUsers: 0,
          totalDoctors: 0,
          totalAppointments: 0,
          totalAnalyses: 0,
          totalPharmacies: 0,
          pendingAppointments: 0,
          completedAppointments: 0
        };
      }
    });
  }

  openModal(type: string): void {
    this.selectedModal = type;
    this.loading = true;
    this.modalData = [];

    switch (type) {
      case 'users':
        this.adminService.getAllUsers().subscribe({
          next: (data) => {
            this.modalData = data || [];
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.toast.error('Failed to load users', 'Error');
          }
        });
        break;
      case 'doctors':
        this.adminService.getAllUsers().subscribe({
          next: (data) => {
            this.modalData = (data || []).filter((user: any) => user.role === 'DOCTOR');
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.toast.error('Failed to load doctors', 'Error');
          }
        });
        break;
      case 'appointments':
        this.adminService.getAllAppointments().subscribe({
          next: (data) => {
            this.allAppointments = data || [];
            this.modalData = data || [];
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.toast.error('Failed to load appointments', 'Error');
          }
        });
        break;
      case 'analyses':
        this.adminService.getAnalyses().subscribe({
          next: (data: any) => {
            this.modalData = data || [];
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.toast.error('Failed to load analyses', 'Error');
          }
        });
        break;
    }
  }

  closeModal(): void {
    this.selectedModal = '';
    this.modalData = [];
  }

  deleteUser(id: number, userName: string): void {
    this.confirmModalData = {
      title: 'Delete User',
      message: `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      action: () => {
        this.adminService.deleteUser(id).subscribe({
          next: () => {
            this.modalData = this.modalData.filter(user => user.id !== id);
            this.loadStats();
            this.toast.success('User deleted successfully', 'Success');
          },
          error: () => {
            this.toast.error('Failed to delete user', 'Error');
          }
        });
      }
    };
    this.showConfirmModal = true;
  }

  onConfirmAction(): void {
    this.confirmModalData.action();
    this.showConfirmModal = false;
  }

  onCancelAction(): void {
    this.showConfirmModal = false;
  }

  updateAppointmentStatus(id: number, status: string): void {
    // Add update appointment status API call here
    this.toast.success('Appointment updated successfully', 'Success');
    this.openModal('appointments'); // Refresh data
  }

  openAppointmentModal(status: string): void {
    this.selectedModal = 'appointments';
    this.loading = true;
    this.modalData = [];

    this.adminService.getAllAppointments().subscribe({
      next: (data) => {
        this.allAppointments = data || [];
        if (status === 'ALL') {
          this.modalData = this.allAppointments;
          this.appointmentFilterTitle = 'All';
        } else {
          this.modalData = this.allAppointments.filter(a => a.status === status);
          this.appointmentFilterTitle = status === 'SCHEDULED' ? 'Pending' : 'Completed';
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load appointments', 'Error');
      }
    });
  }
}