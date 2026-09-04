import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getAllAppointments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointments`);
  }

  addDoctor(doctor: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/doctors`, doctor);
  }

  addPharmacy(pharmacy: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pharmacies`, pharmacy);
  }

  getAllPharmacies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pharmacies`);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  getAnalyses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/analyses`);
  }

  getAppointments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointments`);
  }

  suspendUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}/suspend`, {});
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }
}