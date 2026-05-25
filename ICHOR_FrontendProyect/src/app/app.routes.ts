import { Routes } from '@angular/router';
import { LogIn } from './pages/log-in/log-in';
import { createUserComponent } from './pages/create-users/create-users';
import { UserManager } from './pages/user-manager/user-manager';

export const routes: Routes = [

  {
    path:'log-in',
    component: LogIn
  },
  {
    path:'create-users',
    component:createUserComponent
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
