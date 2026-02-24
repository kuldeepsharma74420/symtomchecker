import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="btn btn-outline-light btn-sm d-flex align-items-center back-btn-fixed"
      (click)="goBack()"
      style="backdrop-filter: blur(10px); border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); position: fixed; top: 100px; left: 20px; z-index: 1020;">
      <span class="me-2">←</span>
      Back
    </button>
  `
})
export class BackButtonComponent {
  constructor(private location: Location) {}

  goBack(): void {
    try {
      this.location.back();
    } catch (error) {
      console.error('Navigation error:', error);
      window.history.back();
    }
  }
}