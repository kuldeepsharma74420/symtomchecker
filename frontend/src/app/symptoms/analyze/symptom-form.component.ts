import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SymptomService } from '../symptom.service';
import { ToastService } from '../../shared/services/toast.service';
import { BackButtonComponent } from '../../shared/components/back-button.component';

@Component({
  selector: 'app-symptom-form',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './symptom-form.component.html'
})
export class SymptomFormComponent {
  symptoms = '';
  analysis: any = null;
  loading = false;

  constructor(
    private symptomService: SymptomService,
    private toast: ToastService
  ) {}

  analyzeSymptoms(): void {
    if (!this.symptoms.trim()) {
      return;
    }

    this.loading = true;
    this.analysis = null;
    
    this.symptomService.analyzeSymptoms(this.symptoms).subscribe({
      next: (result) => {
        this.analysis = result;
        this.loading = false;
        this.toast.success('Analysis complete! Review the results below.', 'Analysis Ready 🎉');
      },
      error: (err) => {
        this.loading = false;
        this.toast.error('Failed to analyze symptoms. Please try again.', 'Analysis Failed 😞');
      }
    });
  }
}