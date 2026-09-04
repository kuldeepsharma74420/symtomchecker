import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar-dashboard fixed-top" *ngIf="currentUser">
      <div class="container-fluid px-4">
        <div class="d-flex justify-content-between align-items-center w-100">
          <!-- Logo -->
          <a class="navbar-brand-dashboard" routerLink="/dashboard">
            🏥 Symptom Checker
          </a>
          
          <!-- Profile Dropdown -->
          <div class="dropdown">
            <button 
              class="btn profile-btn d-flex align-items-center" 
              type="button" 
              data-bs-toggle="dropdown">
              <div class="profile-avatar me-2">
                {{getInitial(currentUser.username)}}
              </div>
              <span class="profile-name">{{ '@' + currentUser.username }}</span>
              <i class="ms-2">▼</i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end glass-card border-0 mt-2">
              <li class="dropdown-header">
                <div class="text-center">
                  <div class="profile-avatar-large mx-auto mb-2">
                    {{getInitial(currentUser.username)}}
                  </div>
                  <div class="fw-bold text-white">{{formatFullName(currentUser.fullName)}}</div>
                  <small class="text-white-50">{{ '@' + currentUser.username }}</small>
                  <div class="mt-1">
                    <span class="badge bg-primary">{{currentUser.role}}</span>
                  </div>
                </div>
              </li>
              <li><hr class="dropdown-divider" style="border-color: rgba(255,255,255,0.2);"></li>
              
              <!-- Simplified Menu -->
              <li *ngIf="currentUser.role === 'ADMIN'"><a class="dropdown-item text-white admin-appointments-link" (click)="openAdminAppointments()">🗓️ All Appointments</a></li>
              <li *ngIf="currentUser.role !== 'ADMIN'"><a class="dropdown-item text-white" routerLink="/my-appointments">🗓️ My Appointments</a></li>
              <li *ngIf="currentUser.role === 'PATIENT'"><a class="dropdown-item text-white" routerLink="/symptoms/history">📋 My History</a></li>
              
              <li><hr class="dropdown-divider" style="border-color: rgba(255,255,255,0.2);"></li>
              <li><button class="dropdown-item text-white" (click)="logout()">🚪 Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-dashboard {
      background: var(--glass-bg) !important;
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
      padding: 12px 0;
      z-index: 1030;
    }
    
    .navbar-brand-dashboard {
      font-weight: 700;
      font-size: 1.5rem;
      color: white;
      text-decoration: none;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    }
    
    .navbar-brand-dashboard:hover {
      color: #e0e0e0;
      text-decoration: none;
    }
    
    .profile-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      color: white;
      padding: 8px 16px;
      transition: all 0.3s ease;
    }
    
    .profile-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      color: white;
    }
    
    .profile-avatar {
      width: 32px;
      height: 32px;
      background: var(--primary-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      color: white;
    }
    
    .profile-avatar-large {
      width: 48px;
      height: 48px;
      background: var(--primary-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
      color: white;
    }
    
    .profile-name {
      font-weight: 500;
      font-size: 14px;
    }
    
    .dropdown-menu {
      min-width: 280px;
      padding: 16px;
      background: rgba(0, 0, 0, 0.8) !important;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
    }
    
    .dropdown-item {
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 4px;
      transition: all 0.2s ease;
    }
    
    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white !important;
    }
    
    .admin-appointments-link {
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .admin-appointments-link:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      transform: translateX(5px);
      color: #fff !important;
    }
  `]
})
export class DashboardNavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.authService.logout();
      }
    });
  }

  getInitial(name?: string): string {
    return name?.charAt(0)?.toUpperCase() || '?';
  }

  formatFullName(name?: string): string {
    if (!name || name.trim() === '') {
      return this.currentUser?.username || 'Unknown User';
    }
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  logout(): void {
    try {
      this.authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      this.router.navigate(['/login']);
    }
  }

  openAdminAppointments(): void {
    this.router.navigate(['/admin/dashboard']).then(() => {
      // Trigger appointments modal after navigation
      setTimeout(() => {
        const appointmentsCard = document.querySelector('[data-appointments="all"]') as HTMLElement;
        if (appointmentsCard) {
          appointmentsCard.click();
        }
      }, 100);
    });
  }
}