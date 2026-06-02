import { Routes } from '@angular/router';
import { LogIn } from './pages/LogInPage/log-in';
import { createUserComponent } from './pages/create-users/create-users';
import { UserManager } from './pages/UserManagerPage/user-manager';
import { DoctorPageComponent } from './pages/DoctorPage/DoctorPageComponent';
import { CoordinatorPageComponent } from './pages/CoordinatorPage/CoordinatorPageComponent';
import { authGuard } from './auth/guards/authGuard.guard';
import { roleGuard } from './auth/guards/roleGuard.guard';
import { UnauthorizedPage } from './pages/UnauthorizedPage/UnauthorizedPage';
import { createPatient } from './pages/create-patient/createPatient.component';

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
     path:'patientCreate',
    component: createPatient
  },
];
