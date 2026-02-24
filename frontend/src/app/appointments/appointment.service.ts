import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment, BookAppointmentRequest, UpdateStatusRequest } from '../shared/models/appointment.model';
import { User } from '../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = `${environment.apiBaseUrl}/appointments`;

  constructor(private http: HttpClient) {}

  bookAppointment(data: BookAppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/book`, data);
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/my-appointments`);
  }

  getDoctors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/doctors`);
  }

  updateStatus(id: number, status: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/status`, { status });
  }

  checkSlotAvailability(doctorId: number, appointmentDate: string): Observable<{available: boolean}> {
    return this.http.get<{available: boolean}>(`${this.apiUrl}/check-slot`, {
      params: { doctorId: doctorId.toString(), appointmentDate }
    });
  }
}