import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../appointment.service';
import { ToastService } from '../../shared/services/toast.service';
import { BackButtonComponent } from '../../shared/components/back-button.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, BackButtonComponent],
  templateUrl: './my-appointments.component.html',
  styles: [`
    .appointment-card {
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .appointment-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .appointment-notes {
      line-height: 1.4;
      min-height: 40px;
    }
    
    .appointment-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 12px;
      margin-top: 12px;
    }
    
    .appointment-time {
      margin-bottom: 8px;
    }
    
    .appointment-actions {
      flex-wrap: wrap;
    }
    
    .btn-sm {
      padding: 4px 8px;
      font-size: 0.75rem;
    }
  `]
})
export class MyAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  loading = false;
  userRole: string = 'PATIENT';
  selectedAppointment: any = null;

  constructor(
    private appointmentService: AppointmentService,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || 'PATIENT';
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getMyAppointments().subscribe({
      next: (data: any) => {
        this.appointments = data || [];
        this.loading = false;

      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load appointments', 'Error 😞');
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  cancelAppointment(id: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.updateStatus(id, 'CANCELLED').subscribe({
        next: () => {
          this.toast.success('Appointment cancelled successfully', 'Cancelled ✅');
          this.loadAppointments();
        },
        error: () => {
          this.toast.error('Failed to cancel appointment', 'Error 😞');
        }
      });
    }
  }

  updateStatus(id: number, status: string): void {
    this.appointmentService.updateStatus(id, status).subscribe({
      next: () => {
        const statusText = status === 'COMPLETED' ? 'completed' : 'cancelled';
        this.toast.success(`Appointment ${statusText} successfully`, 'Success');
        this.loadAppointments();
        this.selectedAppointment = null;
      },
      error: () => {
        this.toast.error('Failed to update appointment', 'Error');
      }
    });
  }

  viewAppointmentDetails(appointment: any): void {
    this.selectedAppointment = appointment;
  }

  closeAppointmentDetails(): void {
    this.selectedAppointment = null;
  }
}