import { inject, signal } from "@angular/core";
import { hlaAllele } from "../../../../interfaces/Coordinator/OrganPostResponse.interface";
import { OrganPetitionService } from "../../../../services/OrganPetitions.service";

import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class OrganPetitionListUtils {


  shownPetition = signal<number | null>(null);
  private organPetitionService = inject(OrganPetitionService);


  show(idPetition: number) {
    if (this.shownPetition() === idPetition) {
      this.shownPetition.set(null);
    } else {
      this.shownPetition.set(idPetition);
    }
  }


  showHla(hla: hlaAllele[]): string {
    let result = '';
    for (let index = 0; index < hla.length; index++) {
      result += hla[index].letter + ":" + hla[index].allele + ":" + hla[index].protein + " ";
    }
    return result.trim();
  }


  acceptPetition(idPetition: number) {
    this.organPetitionService.acceptPetition(idPetition).subscribe({
      next: (success) => {
        console.log('Petition changed status: ', success);
        this.organPetitionService.loadDraftPetitions().subscribe();
        //todo manejar errores aquí también.
      }, error: (err) => {
        // todo manejar errores aquí;
      }
    })
  }

  cancelPetition(idPetition: number) {
    this.organPetitionService.cancelPetition(idPetition).subscribe({
      next: (success) => {
        console.log('Petition changed status: ', success);
        this.organPetitionService.loadWaitingPetitions().subscribe();
        // todo manejar errores aquí también
        this.organPetitionService.loadAssignedPetitions().subscribe();
        // todo manejar errores aquí también
      }, error: (err) => {
        // todo manejar errores aquí;
      }
    })
  }

  deletePetition(idPetition: number) {
    //TODO!
  }

  assingPetition(idPetition: number) {
    this.organPetitionService.assingPetition(idPetition).subscribe({
      next: (success) => {
        console.log('Petition changed status: ', success);
        this.organPetitionService.loadWaitingPetitions().subscribe();
        // todo manejar errorsitos
      }, error: (err) => {
        // todo manejar errores aquí;
      }
    })
  }
}
