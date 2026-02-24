import { User } from './user.model';

export interface Appointment {
  id: number;
  patient: User;
  doctor: User;
  appointmentDate: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
}

export interface BookAppointmentRequest {
  doctorId: number;
  appointmentDate: string;
  notes?: string;
}

export interface UpdateStatusRequest {
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}