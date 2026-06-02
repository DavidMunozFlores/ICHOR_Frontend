import { Routes } from '@angular/router';
import { LogIn } from './pages/LogInPage/log-in';
import { createUserComponent } from './pages/create-users/create-users';
import { UserManager } from './pages/UserManagerPage/user-manager';
import { DoctorPageComponent } from './pages/DoctorPage/DoctorPageComponent';
import { CoordinatorPageComponent } from './pages/CoordinatorPage/CoordinatorPageComponent';
import { authGuard } from './auth/guards/authGuard.guard';
import { roleGuard } from './auth/guards/roleGuard.guard';
import { UnauthorizedPage } from './pages/UnauthorizedPage/UnauthorizedPage';

export const routes: Routes = [

  {
    path: '',
    component: LogIn
  },
  {
    path: 'log-in',
    component: LogIn
  },
  {
    path: 'unauthorized',
    component: UnauthorizedPage
  },
  {
    path: 'create-users',
    component: createUserComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['MANAGER'] }
  },
  {
    path: 'user-manager',
    component: UserManager,
    canActivate: [authGuard, roleGuard],
    data: { role: ['MANAGER'] }
  },
  {
    path: 'doctor-page',
    component: DoctorPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['DOCTOR'] }
  },
  {
    path: 'coordinator-page',
    component: CoordinatorPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['COORDINATOR'] }
  }
];
