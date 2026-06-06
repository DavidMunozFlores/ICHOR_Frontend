import { inject, signal } from "@angular/core";
import { hlaAllele } from "../../../../interfaces/Coordinator/OrganPostResponse.interface";
import { OrganPetitionService } from "../../../../services/OrganPetitions.service";

import { Injectable } from '@angular/core';
import { OrganPetitionResponse } from "../../../../interfaces/Doctor/OrganPetitionResponse.interface";
import { Router } from "@angular/router";
import { InfoMessageService } from "../../../../services/InfoMessage.service";

@Injectable({providedIn: 'root'})
export class OrganPetitionListUtils {

  router = inject(Router);
  infoMessageService = inject(InfoMessageService);

  shownPetition = signal<number | null>(null);
  draftPetition = signal<OrganPetitionResponse | undefined >(undefined);
  isUpdate = signal<boolean>(false);
  private organPetitionService = inject(OrganPetitionService);



  show(idPetition: number) {
    if (this.shownPetition() === idPetition) {
      this.shownPetition.set(null);
    } else {
      this.shownPetition.set(idPetition);
    }
  }


  showHla(hla: hlaAllele[] | undefined): string {
    let result = '';

    if(hla === undefined){
      return result;
    }
    else{
      for (let index = 0; index < hla.length; index++) {
        result += hla[index].letter + ":" + hla[index].allele + ":" + hla[index].protein + " ";
      }
    }
    return result.trim();
  }

  editPetition(petition: OrganPetitionResponse){

    this.draftPetition.set(petition);
    this.isUpdate.set(true);
    this.router.navigate(['./doctor/create-petition']);

  }

  acceptPetition(idPetition: number) {
    this.organPetitionService.acceptPetition(idPetition).subscribe({
      next: (success) => {
        console.log('Petition changed status: ', success);
        this.organPetitionService.loadDraftPetitions().subscribe();
      }, error: (err) => {}
    })
  }

  cancelPetition(idPetition: number) {
    this.organPetitionService.cancelPetition(idPetition).subscribe({
      next: (success) => {
        console.log('Petition changed status: ', success);
        this.organPetitionService.loadWaitingPetitions().subscribe();
        this.organPetitionService.loadAssignedPetitions().subscribe();
      }, error: (err) => {
      }
    })
  }

  deletePetition(idPetition: number) {
   this.organPetitionService.deletePetition(idPetition).subscribe({
      next: (success) => {
        console.log('Petition changed status: ', success);
        this.organPetitionService.loadDraftPetitions().subscribe();
      }, error: (err) => {
      }
    })
  }

  assingPetition(idPetition: number) {
    this.organPetitionService.assingPetition(idPetition).subscribe({
      next: (success) => {
        console.log('Petition changed status: ', success);
        this.organPetitionService.loadWaitingPetitions().subscribe();
      }, error: (err) => {
      }
    })
  }
}
