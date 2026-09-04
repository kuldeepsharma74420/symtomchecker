import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadCurrentUser();
  }

  login(credentials: { username: string; password: string }): Observable<{ token: string; username: string; role?: string; fullName?: string }> {
    const sanitizedCredentials = {
      username: this.sanitizeInput(credentials.username),
      password: credentials.password // Don't sanitize password as it may contain special chars
    };
    
    return this.http.post<{ token: string; username: string; role?: string; fullName?: string }>(`${this.apiUrl}/login`, sanitizedCredentials)
      .pipe(
        tap(response => {
          if (response?.token && response?.username) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', this.sanitizeInput(response.username));
            
            // Set role from backend response or default to PATIENT
            const userRole = response.role ? this.sanitizeInput(response.role) : 'PATIENT';
            localStorage.setItem('userRole', userRole);
            
            // Store and set full name immediately
            const fullName = response.fullName ? this.sanitizeInput(response.fullName) : response.username;
            localStorage.setItem('fullName', fullName);
            
            // Set user data immediately without additional API calls
            const user: User = {
              id: 0,
              username: this.sanitizeInput(response.username),
              email: '',
              fullName: fullName,
              role: userRole as 'PATIENT' | 'DOCTOR' | 'ADMIN',
              createdAt: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      if (Date.now() >= expiry) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  private loadCurrentUser(): void {
    try {
      const cachedUser = localStorage.getItem('currentUser');
      if (cachedUser) {
        const user = JSON.parse(cachedUser);
        this.currentUserSubject.next(this.sanitizeUser(user));
      } else if (this.isLoggedIn()) {
        // Create user from stored data immediately
        const username = localStorage.getItem('username');
        const storedRole = localStorage.getItem('userRole') || 'PATIENT';
        const storedFullName = localStorage.getItem('fullName');
        
        const user: User = {
          id: 0,
          username: username || '',
          email: '',
          fullName: storedFullName || username || '',
          role: storedRole as 'PATIENT' | 'DOCTOR' | 'ADMIN',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      this.logout();
    }
  }
  
  private sanitizeInput(input: string): string {
    if (!input) return '';
    return input.replace(/[<>"'&]/g, '').trim();
  }
  
  private sanitizeUser(user: any): User {
    return {
      id: Number(user.id) || 0,
      username: this.sanitizeInput(user.username || ''),
      email: this.sanitizeInput(user.email || ''),
      fullName: this.sanitizeInput(user.fullName || ''),
      role: user.role || 'PATIENT',
      createdAt: user.createdAt || new Date().toISOString()
    };
  }


}