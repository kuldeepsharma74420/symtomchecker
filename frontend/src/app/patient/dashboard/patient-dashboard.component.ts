import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="modern-dashboard">
      <div class="hero-section">
        <div class="container">
          <div class="hero-content">
            <div class="user-avatar">
              <span class="avatar-text">{{getInitials()}}</span>
            </div>
            <h1 class="hero-title">Hello, {{currentUser?.fullName}}!</h1>
            <p class="hero-subtitle">Your health journey starts here</p>
            <div class="status-badge">
              <span class="status-dot"></span>
              Active Patient
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Quick Actions</h2>
          <p class="section-subtitle">Choose what you'd like to do today</p>
        </div>
        
        <div class="actions-grid">
          <div class="action-card primary-card" routerLink="/symptoms/analyze">
            <div class="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title">Symptom Analysis</h3>
              <p class="card-description">AI-powered health assessment</p>
            </div>
            <div class="card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="action-card secondary-card" routerLink="/book-appointment">
            <div class="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title">Book Appointment</h3>
              <p class="card-description">Schedule with specialists</p>
            </div>
            <div class="card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="action-card accent-card" routerLink="/symptoms/history">
            <div class="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title">Medical History</h3>
              <p class="card-description">View past consultations</p>
            </div>
            <div class="card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div class="action-card info-card" routerLink="/my-appointments">
            <div class="card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M16 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V6C4 4.89543 4.89543 4 6 4H8M16 4C16 2.89543 15.1046 2 14 2H10C8.89543 2 8 2.89543 8 4M16 4C16 5.10457 15.1046 6 14 6H10C8.89543 6 8 5.10457 8 4M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="card-content">
              <h3 class="card-title">My Appointments</h3>
              <p class="card-description">Manage your bookings</p>
            </div>
            <div class="card-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modern-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      padding-bottom: 2rem;
    }

    .hero-section {
      padding: 3rem 0;
      background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .hero-content {
      text-align: center;
      color: white;
    }

    .user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 32px rgba(79, 70, 229, 0.3);
    }

    .avatar-text {
      font-size: 1.5rem;
      font-weight: 700;
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

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      animation: pulse 2s infinite;
    }

    .section-header {
      text-align: center;
      margin: 3rem 0 2rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.5rem;
    }

    .section-subtitle {
      color: rgba(255, 255, 255, 0.6);
      font-size: 1rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .action-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .action-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .primary-card:hover {
      background: rgba(79, 70, 229, 0.1);
      border-color: rgba(79, 70, 229, 0.3);
    }

    .secondary-card:hover {
      background: rgba(147, 51, 234, 0.1);
      border-color: rgba(147, 51, 234, 0.3);
    }

    .accent-card:hover {
      background: rgba(34, 197, 94, 0.1);
      border-color: rgba(34, 197, 94, 0.3);
    }

    .info-card:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: rgba(59, 130, 246, 0.3);
    }

    .card-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      flex-shrink: 0;
    }

    .primary-card .card-icon {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
    }

    .secondary-card .card-icon {
      background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%);
    }

    .accent-card .card-icon {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }

    .info-card .card-icon {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .card-content {
      flex: 1;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.25rem;
    }

    .card-description {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      margin: 0;
    }

    .card-arrow {
      color: rgba(255, 255, 255, 0.4);
      transition: all 0.3s ease;
    }

    .action-card:hover .card-arrow {
      color: white;
      transform: translateX(4px);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 0 1rem;
      }
      
      .action-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class PatientDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading user in patient dashboard:', error);
      }
    });
  }

  getInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    return this.currentUser.fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}