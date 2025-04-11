import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');

  return isLoggedIn === 'true' ? true : router.parseUrl('/auth/login');
};
