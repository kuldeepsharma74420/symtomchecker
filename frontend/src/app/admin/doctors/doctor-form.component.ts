import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-form.component.html'
})
export class DoctorFormComponent {
  doctor = {
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: ''
  };
  
  loading = false;
  error = '';
  success = '';
  message = '';

  constructor(private adminService: AdminService) {}

  addDoctor(): void {
    if (!this.validateForm()) return;
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    this.adminService.addDoctor(this.doctor).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Doctor added successfully!';
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to add doctor. Please try again.';
      }
    });
  }
  
  private validateForm(): boolean {
    return !!(this.doctor.username?.trim() && 
             this.doctor.email?.trim() && 
             this.doctor.password?.trim() && 
             this.doctor.fullName?.trim());
  }
  
  private resetForm(): void {
    this.doctor = {
      username: '',
      email: '',
      password: '',
      fullName: '',
      phone: ''
    };
  }
}