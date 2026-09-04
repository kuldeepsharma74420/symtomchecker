import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorLoggingService } from './error-logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private errorLoggingService = inject(ErrorLoggingService);

  handleError(error: any): void {
    // Log the error
    this.errorLoggingService.logError(error, 'Global Error Handler');

    // Don't break the app - let it continue running
    console.error('Global error caught:', error);

    // In production, you might want to show a user-friendly message
    // or redirect to an error page
    if (this.isProductionMode()) {
      this.handleProductionError(error);
    }
  }

  private isProductionMode(): boolean {
    return typeof window !== 'undefined' && 
           window.location.hostname !== 'localhost' && 
           !window.location.hostname.includes('127.0.0.1');
  }

  private handleProductionError(error: any): void {
    // In production, show user-friendly error messages
    // and potentially redirect to error page for critical errors
    
    if (this.isCriticalError(error)) {
      // For critical errors, you might want to reload the page
      // or redirect to a maintenance page
      console.error('Critical error detected:', error);
    }
  }

  private isCriticalError(error: any): boolean {
    // Define what constitutes a critical error
    const criticalErrorTypes = [
      'ChunkLoadError',
      'SecurityError',
      'NetworkError'
    ];

    return criticalErrorTypes.some(type => 
      error?.name === type || 
      error?.message?.includes(type) ||
      error?.toString()?.includes(type)
    );
  }
}