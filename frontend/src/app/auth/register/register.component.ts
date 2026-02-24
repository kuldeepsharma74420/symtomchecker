import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { sanitizeInput, validateEmail, validatePassword } from '../../shared/config/security.config';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: ''
  };
  error = '';
  success = '';
  loading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toast: ToastService
  ) {}

  register(): void {
    if (!this.validateForm()) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Registration successful! Redirecting to login...', 'Welcome! 🎉');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        console.error('Registration error:', err);
        // Extract the actual error message from backend
        let errorMessage = 'Registration failed. Please try again.';
        if (typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        this.error = errorMessage;
        this.toast.error(errorMessage, 'Registration Failed 😢');
      }
    });
  }

  private validateForm(): boolean {
    // Sanitize inputs
    this.user.username = sanitizeInput(this.user.username);
    this.user.email = sanitizeInput(this.user.email);
    this.user.fullName = sanitizeInput(this.user.fullName);
    this.user.phone = sanitizeInput(this.user.phone);
    
    if (!this.user.username.trim()) {
      this.toast.warning('Username is required', 'Validation Error');
      return false;
    }
    
    if (!this.user.email.trim()) {
      this.toast.warning('Email is required', 'Validation Error');
      return false;
    }
    
    if (!validateEmail(this.user.email)) {
      this.toast.warning('Please enter a valid email address', 'Validation Error');
      return false;
    }
    
    if (!this.user.password.trim()) {
      this.toast.warning('Password is required', 'Validation Error');
      return false;
    }
    
    const passwordValidation = validatePassword(this.user.password);
    if (!passwordValidation.valid) {
      this.toast.warning(passwordValidation.errors[0], 'Validation Error');
      return false;
    }
    
    if (!this.user.fullName.trim()) {
      this.toast.warning('Full name is required', 'Validation Error');
      return false;
    }
    
    if (!this.user.role) {
      this.toast.warning('Please select a role', 'Validation Error');
      return false;
    }
    
    return true;
  }
}
