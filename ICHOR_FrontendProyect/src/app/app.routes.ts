import { Routes } from '@angular/router';

import { LogIn } from './pages/LogInPage/log-in';
import { UserManager } from './pages/UserManagerPage/user-manager';
import { createUserComponent } from './pages/UserManagerPage/create-users/create-users';
import { DoctorPageComponent } from './pages/DoctorPage/DoctorPageComponent';
import { CoordinatorPageComponent } from './pages/CoordinatorPage/CoordinatorPageComponent';
import { authGuard } from './auth/guards/authGuard.guard';
import { roleGuard } from './auth/guards/roleGuard.guard';
import { UnauthorizedPage } from './pages/UnauthorizedPage/UnauthorizedPage';
import { OrganPetitionManagement } from './pages/DoctorPage/OrganPetitionManagement/OrganPetitionManagement';

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
    path:'user-manager',
    component: UserManager
  },
  {
    path: 'unauthorized',
    component: UnauthorizedPage
  },
  {
    path: 'user-manager',
    loadChildren: () => import('./pages/UserManagerPage/userManager.routes'),
    canActivate: [authGuard, roleGuard],
    data: { role: ['MANAGER'] }
  },
  {
    path: 'doctor',
    loadChildren: () => import('./pages/DoctorPage/doctor.routes'),
    canActivate: [authGuard, roleGuard],
    data: { role: ['DOCTOR'] }
  },
  {
    path: 'coordinator',
    component: CoordinatorPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['COORDINATOR'] }
  },

];
