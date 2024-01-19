import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

export const noauthGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const status = authService.loggedIn();

  if (status) {
    // If  logged in, redirect to the home page
    return router.navigate(['/group/list']);
  } else {

    return true;
  }
}; 
