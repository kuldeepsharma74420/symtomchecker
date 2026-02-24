import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../appointment.service';
import { ToastService } from '../../shared/services/toast.service';
import { BackButtonComponent } from '../../shared/components/back-button.component';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './book-appointment.component.html'
})
export class BookAppointmentComponent implements OnInit {
  doctors: any[] = [];
  selectedDoctorId = '';
  appointmentDate = '';
  appointmentTime = '';
  notes = '';
  loading = false;
  loadingDoctors = false;
  minDate = '';

  constructor(
    private appointmentService: AppointmentService,
    private toast: ToastService,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loadingDoctors = true;
    this.appointmentService.getDoctors().subscribe({
      next: (data: any) => {
        this.doctors = data || [];
        this.loadingDoctors = false;

      },
      error: () => {
        this.loadingDoctors = false;
        this.toast.error('Failed to load doctors', 'Error 😞');
      }
    });
  }

  bookAppointment(): void {
    if (!this.selectedDoctorId || !this.appointmentDate || !this.appointmentTime) {
      return;
    }

    this.loading = true;
    const appointmentDateTime = `${this.appointmentDate}T${this.appointmentTime}:00`;
    
    // Check slot availability first
    this.appointmentService.checkSlotAvailability(parseInt(this.selectedDoctorId), appointmentDateTime).subscribe({
      next: (response) => {
        if (!response.available) {
          this.loading = false;
          this.toast.error('This time slot is not available. Please choose a different time.', 'Slot Unavailable ⏰');
          return;
        }
        
        // Proceed with booking if slot is available
        this.appointmentService.bookAppointment({
          doctorId: parseInt(this.selectedDoctorId),
          appointmentDate: appointmentDateTime,
          notes: this.notes
        }).subscribe({
          next: () => {
            this.loading = false;
            this.toast.success('Appointment booked successfully!', 'Success 🎉');
            this.selectedDoctorId = '';
            this.appointmentDate = '';
            this.appointmentTime = '';
            this.notes = '';
            setTimeout(() => {
              this.router.navigate(['/my-appointments']);
            }, 1000);
          },
          error: () => {
            this.loading = false;
            this.toast.error('Failed to book appointment', 'Booking Failed 😞');
          }
        });
      },
      error: () => {
        // If slot check fails, proceed with booking anyway
        this.appointmentService.bookAppointment({
          doctorId: parseInt(this.selectedDoctorId),
          appointmentDate: appointmentDateTime,
          notes: this.notes
        }).subscribe({
          next: () => {
            this.loading = false;
            this.toast.success('Appointment booked successfully!', 'Success 🎉');
            this.selectedDoctorId = '';
            this.appointmentDate = '';
            this.appointmentTime = '';
            this.notes = '';
            setTimeout(() => {
              this.router.navigate(['/my-appointments']);
            }, 1000);
          },
          error: () => {
            this.loading = false;
            this.toast.error('Failed to book appointment', 'Booking Failed 😞');
          }
        });
      }
    });
  }
}