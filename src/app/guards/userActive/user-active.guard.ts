import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';

export const userActiveGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.user() === null;
};
