import { Injectable } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  try {
    const authService = inject(AuthService);
    const router = inject(Router);
    const expectedRole = route.data['role'];

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    const userRole = authService.getUserRole();
    if (userRole === expectedRole) {
      return true;
    } else {
      router.navigate(['/dashboard']);
      return false;
    }
  } catch (error) {
    console.error('Role guard error:', error);
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }
};