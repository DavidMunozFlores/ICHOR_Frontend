import { Routes } from "@angular/router";
import { UserManager } from "./user-manager";
import { authGuard } from "../../auth/guards/authGuard.guard";
import { roleGuard } from "../../auth/guards/roleGuard.guard";
import { createUserComponent } from "./create-users/create-users";

export const userManagerRoutes: Routes = [

  {
    path:'',
    component: UserManager,
    canActivate: [authGuard, roleGuard],
    data: { role: ['MANAGER'] },
  },
  {
    path: 'create-users',
    component: createUserComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['MANAGER'] }
  },

]


export default userManagerRoutes;
