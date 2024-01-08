import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject, ɵɵinject } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { map } from 'rxjs';
export const authGuard: CanActivateFn = (route, state) => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const status = authService.loggedIn();

  if (status) {
    return true;
  } else {
    // If not logged in, redirect to the login page
    return router.navigate(['/login']);
  }
}; 
