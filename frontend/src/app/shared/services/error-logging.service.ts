import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ErrorLog {
  timestamp: Date;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorLoggingService {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  constructor(private http: HttpClient) {}

  logError(error: any, context?: string): void {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      level: 'error',
      message: this.extractErrorMessage(error, context),
      stack: error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };

    this.addLog(errorLog);
    
    if (environment.production) {
      this.sendToServer(errorLog);
    } else {
      console.error('Error logged:', errorLog);
    }
  }

  logWarning(message: string, context?: string): void {
    const warningLog: ErrorLog = {
      timestamp: new Date(),
      level: 'warn',
      message: context ? `${context}: ${message}` : message,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };

    this.addLog(warningLog);
    
    if (environment.production) {
      this.sendToServer(warningLog);
    } else {
      console.warn('Warning logged:', warningLog);
    }
  }

  logInfo(message: string, context?: string): void {
    const infoLog: ErrorLog = {
      timestamp: new Date(),
      level: 'info',
      message: context ? `${context}: ${message}` : message,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };

    this.addLog(infoLog);
  }

  private extractErrorMessage(error: any, context?: string): string {
    let message = 'Unknown error occurred';
    
    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.error?.message) {
      message = error.error.message;
    }
    
    return context ? `${context}: ${message}` : message;
  }

  private addLog(log: ErrorLog): void {
    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  private getCurrentUserId(): string | undefined {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        return user.id?.toString();
      }
    } catch (error) {
      // Ignore error in error logging service
    }
    return undefined;
  }

  private sendToServer(log: ErrorLog): void {
    try {
      this.http.post(`${environment.apiBaseUrl}/logs/error`, log).subscribe({
        error: (error) => {
          // Silently fail - don't create infinite loop
          console.error('Failed to send error log to server:', error);
        }
      });
    } catch (error) {
      // Silently fail
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}