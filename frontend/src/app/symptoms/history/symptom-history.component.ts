import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SymptomService } from '../symptom.service';
import { ToastService } from '../../shared/services/toast.service';
import { BackButtonComponent } from '../../shared/components/back-button.component';

@Component({
  selector: 'app-symptom-history',
  standalone: true,
  imports: [CommonModule, RouterLink, BackButtonComponent],
  templateUrl: './symptom-history.component.html'
})
export class SymptomHistoryComponent implements OnInit {
  history: any[] = [];
  loading = false;

  constructor(
    private symptomService: SymptomService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.symptomService.getHistory().subscribe({
      next: (data: any) => {
        this.history = data || [];
        this.loading = false;
        if (this.history.length > 0) {
          this.toast.success(`Found ${this.history.length} previous analyses`, 'History Loaded 📊');
        }
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load history', 'Error 😞');
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  reanalyze(symptoms: string): void {
    this.router.navigate(['/symptoms/analyze'], { queryParams: { symptoms } });
  }
}