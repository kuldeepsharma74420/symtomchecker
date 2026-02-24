import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BookAppointmentComponent } from './appointments/book/book-appointment.component';
import { MyAppointmentsComponent } from './appointments/my/my-appointments.component';
import { SymptomFormComponent } from './symptoms/analyze/symptom-form.component';
import { SymptomHistoryComponent } from './symptoms/history/symptom-history.component';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { UserListComponent } from './admin/users/user-list.component';
import { DoctorFormComponent } from './admin/doctors/doctor-form.component';
import { AppointmentListComponent } from './admin/appointments/appointment-list.component';
import { AnalysisListComponent } from './admin/analyses/analysis-list.component';

import { DashboardComponent } from './shared/components/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

export const appRoutes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },

  // Patient routes
  { 
    path: 'symptoms/analyze', 
    component: SymptomFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'symptoms/history', 
    component: SymptomHistoryComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'book-appointment', 
    component: BookAppointmentComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'my-appointments', 
    component: MyAppointmentsComponent, 
    canActivate: [AuthGuard] 
  },


  // Admin routes
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/users', 
    component: UserListComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/doctors', 
    component: DoctorFormComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/appointments', 
    component: AppointmentListComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { role: 'ADMIN' } 
  },
  { 
    path: 'admin/analyses', 
    component: AnalysisListComponent, 
    canActivate: [AuthGuard, RoleGuard], 
    data: { role: 'ADMIN' } 
  },

  { 
    path: '**', 
    redirectTo: '/login' 
  }
];
