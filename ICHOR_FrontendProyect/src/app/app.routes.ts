import { Routes } from '@angular/router';
import { LogIn } from './pages/LogInPage/log-in';
import { UserManager } from './pages/UserManagerPage/user-manager';
import { DoctorPageComponent } from './pages/DoctorPage/DoctorPageComponent';
import { CoordinatorPageComponent } from './pages/CoordinatorPage/CoordinatorPageComponent';

export const routes: Routes = [

  {
    path:'log-in',
    component: LogIn
  },
  {
     path:'',
    component: LogIn
  },
  {
    path:'user-manager',
    component: UserManager
  },
  {
    path:'doctor-page',
    component: DoctorPageComponent
  },
  {
    path:'coordinator-page',
    component: CoordinatorPageComponent
  }
];
