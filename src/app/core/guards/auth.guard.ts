import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard — function that called before opening route
 * if user not logged in then redirect to /login
 * if user logged in then allow access to route
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.createUrlTree(['/login']);
  return false; // Return false to prevent navigation
};