import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { User } from '../models/user.model';
import { DoctorDashboardComponent } from '../../doctor/dashboard/doctor-dashboard.component';
import { AdminDashboardComponent } from '../../admin/dashboard/admin-dashboard.component';
import { PatientDashboardComponent } from '../../patient/dashboard/patient-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DoctorDashboardComponent, AdminDashboardComponent, PatientDashboardComponent],
  template: `
    <!-- Doctor Dashboard -->
    <app-doctor-dashboard *ngIf="currentUser?.role === 'DOCTOR'"></app-doctor-dashboard>
    
    <!-- Admin Dashboard -->
    <app-admin-dashboard *ngIf="currentUser?.role === 'ADMIN'"></app-admin-dashboard>
    
    <!-- Patient Dashboard -->
    <app-patient-dashboard *ngIf="currentUser?.role === 'PATIENT'"></app-patient-dashboard>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading user in dashboard:', error);
      }
    });
  }
}