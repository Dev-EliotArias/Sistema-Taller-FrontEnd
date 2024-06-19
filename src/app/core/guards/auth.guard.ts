import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {

  let authService = inject(AuthService);
  let router = inject(Router);
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // if (route.routeConfig?.path !== 'dashboard' && route.routeConfig?.path !== '') {
  //   router.navigate(['/dashboard']);
  // }

  return true;
};



