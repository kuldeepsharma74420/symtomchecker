import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SymptomAnalysis, SymptomRequest } from '../shared/models/symptom-analysis.model';

@Injectable({ providedIn: 'root' })
export class SymptomService {
  private apiUrl = `${environment.apiBaseUrl}/symptoms`;

  constructor(private http: HttpClient) {}

  analyzeSymptoms(symptoms: string): Observable<SymptomAnalysis> {
    return this.http.post<SymptomAnalysis>(`${this.apiUrl}/analyze`, { symptoms });
  }

  getHistory(): Observable<SymptomAnalysis[]> {
    return this.http.get<SymptomAnalysis[]>(`${this.apiUrl}/history`);
  }
}