import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toast: ToastService
  ) {}

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.toast.warning('Please enter both username and password', 'Missing Information');
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Welcome back! Redirecting...', 'Login Successful 🎉');
        // Wait for user profile to load, then navigate based on role
        setTimeout(() => {
          const role = this.authService.getUserRole();
          this.navigateByRole(role);
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Invalid credentials';
        this.toast.error(this.error, 'Login Failed 😢');
      }
    });
  }

  private navigateByRole(role: string | null): void {
    // Always go to dashboard first to show the modern UI
    this.router.navigate(['/dashboard']);
  }
}