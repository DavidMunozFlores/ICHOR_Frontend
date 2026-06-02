import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/AuthService.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const allowedRole = route.data['role'][0];
  console.log(allowedRole);

  if(!authService.hasRequiredRole(allowedRole)){
    console.log(`No tiene el rol requerido [${allowedRole} != ${sessionStorage.getItem('role')}]`)
    router.navigate(['/unauthorized']);

    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('role');
    sessionStorage.clear();

    return false;
  }


  return true;
};
