import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../appointments/appointment.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="doctor-dashboard">
      <div class="hero-section">
        <div class="container">
          <div class="hero-content">
            <div class="doctor-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h1 class="hero-title">Doctor Portal</h1>
            <p class="hero-subtitle">Manage appointments and patient care</p>
            <div class="status-badge">
              <span class="status-dot doctor-dot"></span>
              Medical Professional
            </div>
          </div>
        </div>
      </div>

      <div class="container">
      
      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="glass-card p-4 text-center slide-in" style="cursor: pointer;" (click)="filterAppointments('ALL')">
            <div class="display-4 mb-2">📅</div>
            <h3 class="card-title">{{totalAppointments}}</h3>
            <p class="card-text">Total Appointments</p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="glass-card p-4 text-center slide-in" style="animation-delay: 0.1s; cursor: pointer;" (click)="filterAppointments('SCHEDULED')">
            <div class="display-4 mb-2">⏰</div>
            <h3 class="card-title">{{pendingAppointments}}</h3>
            <p class="card-text">Pending Appointments</p>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="glass-card p-4 text-center slide-in" style="animation-delay: 0.2s; cursor: pointer;" (click)="filterAppointments('COMPLETED')">
            <div class="display-4 mb-2">✅</div>
            <h3 class="card-title">{{completedAppointments}}</h3>
            <p class="card-text">Completed Today</p>
          </div>
        </div>
      </div>
      
      <!-- Recent Appointments Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="glass-card p-4 slide-in" style="animation-delay: 0.3s">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="card-title mb-0">📋 Recent Appointments</h4>
              <a routerLink="/my-appointments" class="btn btn-modern text-white">
                View All Appointments
              </a>
            </div>
            
            <div *ngIf="recentAppointments.length === 0" class="text-center py-4">
              <div class="display-4 mb-2">📅</div>
              <p class="text-secondary-custom">No appointments scheduled yet</p>
            </div>
            
            <div class="row" *ngIf="recentAppointments.length > 0">
              <div *ngFor="let appointment of recentAppointments; let i = index" class="col-lg-6 mb-3">
                <div class="glass-card-light p-4 h-100 appointment-card" (click)="viewAppointmentDetails(appointment)" style="cursor: pointer;">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge" 
                          [class.bg-warning]="appointment.status === 'SCHEDULED'"
                          [class.bg-success]="appointment.status === 'COMPLETED'"
                          [class.bg-danger]="appointment.status === 'CANCELLED'">
                      {{appointment.status}}
                    </span>
                    <small class="text-muted-custom fw-bold">{{formatDate(appointment.appointmentDate)}}</small>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <h6 class="card-title mb-2">👤 {{appointment.patient?.fullName || 'Unknown Patient'}}</h6>
                      <p class="card-text small mb-1">📧 {{appointment.patient?.email || 'No email'}}</p>
                      <p class="card-text small mb-1">📱 {{appointment.patient?.phone || 'No phone'}}</p>
                      <p class="card-text small mb-2">⏰ {{formatTime(appointment.appointmentDate)}}</p>
                    </div>
                    
                    <div class="col-md-6" *ngIf="appointment.notes">
                      <h6 class="text-secondary-custom small mb-1">📝 Patient Notes:</h6>
                      <p class="card-text small text-muted-custom">{{appointment.notes | slice:0:100}}{{appointment.notes?.length > 100 ? '...' : ''}}</p>
                    </div>
                  </div>
                  
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <button 
                      *ngIf="appointment.status === 'SCHEDULED'" 
                      class="btn btn-sm btn-outline-light"
                      (click)="updateStatus(appointment.id, 'COMPLETED'); $event.stopPropagation()">
                      ✅ Mark Complete
                    </button>
                    <button class="btn btn-sm btn-outline-primary" (click)="viewAppointmentDetails(appointment); $event.stopPropagation()">
                      👁️ View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Appointments List Modal -->
      <div *ngIf="showAppointmentsModal" class="modal-overlay" (click)="closeAppointmentsModal()">
        <div class="modal-content glass-card p-4" (click)="$event.stopPropagation()" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="card-title mb-0">📅 {{appointmentModalTitle}} Appointments</h4>
            <button class="btn btn-sm btn-outline-light" (click)="closeAppointmentsModal()">✕</button>
          </div>
          
          <div *ngIf="modalAppointments.length === 0" class="text-center py-4">
            <p class="text-muted">No appointments found</p>
          </div>
          
          <div *ngFor="let appointment of modalAppointments" class="glass-card-light p-3 mb-3">
            <div class="row">
              <div class="col-md-8">
                <h6 class="mb-1">👤 {{appointment.patient?.fullName}}</h6>
                <p class="mb-1 small">📅 {{formatDate(appointment.appointmentDate)}} - {{formatTime(appointment.appointmentDate)}}</p>
                <p class="mb-1 small" *ngIf="appointment.notes">📝 {{appointment.notes}}</p>
                <span class="badge" 
                      [class.bg-warning]="appointment.status === 'SCHEDULED'"
                      [class.bg-success]="appointment.status === 'COMPLETED'"
                      [class.bg-danger]="appointment.status === 'CANCELLED'">
                  {{appointment.status}}
                </span>
              </div>
              <div class="col-md-4 text-end">
                <button *ngIf="appointment.status === 'SCHEDULED'" 
                        class="btn btn-sm btn-success me-2" 
                        (click)="updateStatus(appointment.id, 'COMPLETED')">
                  ✅ Complete
                </button>
                <button class="btn btn-sm btn-outline-primary" (click)="viewAppointmentDetails(appointment)">
                  👁️ View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Appointment Details Modal -->
      <div *ngIf="selectedAppointment" class="modal-overlay" (click)="closeAppointmentDetails()">
        <div class="modal-content glass-card p-4" (click)="$event.stopPropagation()">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="card-title mb-0">📋 Appointment Details</h4>
            <button class="btn btn-sm btn-outline-light" (click)="closeAppointmentDetails()">
              ✕
            </button>
          </div>
          
          <div class="row">
            <div class="col-md-6 mb-3">
              <h6 class="text-secondary-custom">Patient Information</h6>
              <p class="mb-1"><strong>Name:</strong> {{selectedAppointment.patient?.fullName}}</p>
              <p class="mb-1"><strong>Email:</strong> {{selectedAppointment.patient?.email}}</p>
              <p class="mb-1"><strong>Phone:</strong> {{selectedAppointment.patient?.phone || 'Not provided'}}</p>
            </div>
            
            <div class="col-md-6 mb-3">
              <h6 class="text-secondary-custom">Appointment Information</h6>
              <p class="mb-1"><strong>Date:</strong> {{formatDate(selectedAppointment.appointmentDate)}}</p>
              <p class="mb-1"><strong>Time:</strong> {{formatTime(selectedAppointment.appointmentDate)}}</p>
              <p class="mb-1"><strong>Status:</strong> 
                <span class="badge" 
                      [class.bg-warning]="selectedAppointment.status === 'SCHEDULED'"
                      [class.bg-success]="selectedAppointment.status === 'COMPLETED'"
                      [class.bg-danger]="selectedAppointment.status === 'CANCELLED'">
                  {{selectedAppointment.status}}
                </span>
              </p>
            </div>
          </div>
          
          <div *ngIf="selectedAppointment.notes" class="mb-3">
            <h6 class="text-secondary-custom">Patient Notes</h6>
            <p class="card-text">{{selectedAppointment.notes}}</p>
          </div>
          
          <div class="d-flex gap-2">
            <button 
              *ngIf="selectedAppointment.status === 'SCHEDULED'" 
              class="btn btn-success"
              (click)="updateStatus(selectedAppointment.id, 'COMPLETED')">
              ✅ Mark as Completed
            </button>
            <button 
              *ngIf="selectedAppointment.status === 'SCHEDULED'" 
              class="btn btn-danger"
              (click)="updateStatus(selectedAppointment.id, 'CANCELLED')">
              ❌ Cancel Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .doctor-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      padding-bottom: 2rem;
    }

    .hero-section {
      padding: 3rem 0;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .hero-content {
      text-align: center;
      color: white;
    }

    .doctor-icon {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #22c55e 0%, #3b82f6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3);
      color: white;
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1.5rem;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      color: #22c55e;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .doctor-dot {
      background: #22c55e;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .glass-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .glass-card-light {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      backdrop-filter: blur(8px);
    }

    .card-title {
      color: white !important;
    }

    .card-text {
      color: rgba(255, 255, 255, 0.7) !important;
    }

    .text-secondary-custom {
      color: rgba(255, 255, 255, 0.6) !important;
    }

    .text-muted-custom {
      color: rgba(255, 255, 255, 0.5) !important;
    }

    .btn-modern {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      border: none;
      border-radius: 12px;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
    }

    .btn-modern:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      max-width: 800px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      background: rgba(15, 15, 35, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
    }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  totalAppointments = 0;
  pendingAppointments = 0;
  completedAppointments = 0;
  recentAppointments: any[] = [];
  allAppointments: any[] = [];
  selectedAppointment: any = null;
  showAppointmentsModal = false;
  modalAppointments: any[] = [];
  appointmentModalTitle = '';

  constructor(
    private appointmentService: AppointmentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDoctorData();
  }

  loadDoctorData(): void {
    this.appointmentService.getMyAppointments().subscribe({
      next: (appointments: any[]) => {
        this.allAppointments = appointments;
        this.recentAppointments = appointments.slice(0, 6);
        this.totalAppointments = appointments.length;
        this.pendingAppointments = appointments.filter(a => a.status === 'SCHEDULED').length;
        this.completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
      },
      error: () => {
        this.toast.error('Failed to load appointments', 'Error');
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  updateStatus(id: number, status: string): void {
    this.appointmentService.updateStatus(id, status).subscribe({
      next: () => {
        const statusText = status === 'COMPLETED' ? 'completed' : 'cancelled';
        this.toast.success(`Appointment ${statusText} successfully`, 'Success');
        this.loadDoctorData();
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

  filterAppointments(status: string): void {
    this.showAppointmentsModal = true;
    if (status === 'ALL') {
      this.modalAppointments = this.allAppointments;
      this.appointmentModalTitle = 'All';
    } else if (status === 'SCHEDULED') {
      this.modalAppointments = this.allAppointments.filter(a => a.status === 'SCHEDULED');
      this.appointmentModalTitle = 'Pending';
    } else if (status === 'COMPLETED') {
      this.modalAppointments = this.allAppointments.filter(a => a.status === 'COMPLETED');
      this.appointmentModalTitle = 'Completed';
    }
  }

  closeAppointmentsModal(): void {
    this.showAppointmentsModal = false;
    this.modalAppointments = [];
  }
}