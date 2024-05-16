import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  let authService = inject(AuthService);
  let routerServices = inject(Router);
  if (!authService.isLoggedIn()) {
    routerServices.navigate(['/login']);
    return false;
  }

  return true;
};
