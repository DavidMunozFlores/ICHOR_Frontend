import { Routes } from '@angular/router';
import { LogIn } from './pages/log-in/log-in';

export const routes: Routes = [

  {
    path:'log-in',
    component: LogIn
  },
  {
     path:'',
    component: LogIn
  }
];
