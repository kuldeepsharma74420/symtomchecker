import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(message: string, title?: string): void {
    this.toastr.success(message, title, {
      timeOut: 2000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr toast-modern toast-success-modern',
      titleClass: 'toast-title-modern',
      messageClass: 'toast-message-modern'
    });
  }

  error(message: string, title?: string): void {
    this.toastr.error(message, title, {
      timeOut: 2000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr toast-modern toast-error-modern',
      titleClass: 'toast-title-modern',
      messageClass: 'toast-message-modern'
    });
  }

  warning(message: string, title?: string): void {
    this.toastr.warning(message, title, {
      timeOut: 2000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr toast-modern toast-warning-modern',
      titleClass: 'toast-title-modern',
      messageClass: 'toast-message-modern'
    });
  }

  info(message: string, title?: string): void {
    this.toastr.info(message, title, {
      timeOut: 2000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      toastClass: 'ngx-toastr toast-modern toast-info-modern',
      titleClass: 'toast-title-modern',
      messageClass: 'toast-message-modern'
    });
  }
}