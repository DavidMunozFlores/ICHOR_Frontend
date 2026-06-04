import { Routes } from "@angular/router";
import { DoctorPageComponent } from "./DoctorPageComponent";
import { CoordinatorPageComponent } from "../CoordinatorPage/CoordinatorPageComponent";
import { authGuard } from "../../auth/guards/authGuard.guard";
import { roleGuard } from "../../auth/guards/roleGuard.guard";
import { OrganPetitionManagement } from "./OrganPetitionManagement/OrganPetitionManagement";
import { AssignedPetitions } from "./OrganPetitionManagement/pages/assignedPetitions/assignedPetitions";
import { WaitingPetitions } from "./OrganPetitionManagement/pages/waitingPetitions/waitingPetitions";
import { CancelledPetitions } from "./OrganPetitionManagement/pages/cancelledPetitions/cancelledPetitions";
import { DraftPetitions } from "./OrganPetitionManagement/pages/draftPetitions/draftPetitions";
import { OrganPetition } from "./OrganPetition/OrganPetition";
import { Component } from '@angular/core';


export const doctorRoutes: Routes = [

  {
    path: '',
    component: DoctorPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: ['DOCTOR'] },
  },
  {
    path: 'create-petition',
    component: OrganPetition,
    canActivate: [authGuard, roleGuard],
    data: { role: ['DOCTOR'] },
  },
  {
    path: 'organ-petitions',
    component: OrganPetitionManagement,
    canActivate: [authGuard, roleGuard],
    data: { role: ['DOCTOR'] },
    children: [
      {
        path: '',
        redirectTo: 'waiting',
        pathMatch: 'full'
      },
      {
        path: 'assigned',
        component: AssignedPetitions,
        canActivate: [authGuard, roleGuard],
        data: { role: ['DOCTOR'] },
      },
      {
        path: 'waiting',
        component: WaitingPetitions,
        canActivate: [authGuard, roleGuard],
        data: { role: ['DOCTOR'] },
      },
      {
        path: 'cancelled',
        component: CancelledPetitions,
        canActivate: [authGuard, roleGuard],
        data: { role: ['DOCTOR'] },
      },
      {
        path: 'draft',
        component: DraftPetitions,
        canActivate: [authGuard, roleGuard],
        data: { role: ['DOCTOR'] },
      },
    ]
  }

];


export default doctorRoutes;
