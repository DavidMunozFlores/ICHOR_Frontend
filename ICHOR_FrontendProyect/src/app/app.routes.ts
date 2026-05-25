import { Routes } from '@angular/router';
import { LogIn } from './pages/log-in/log-in';
import { UserManager } from './pages/user-manager/user-manager';

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
  }
];
