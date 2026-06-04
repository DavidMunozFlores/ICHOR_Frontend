import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { OrganPetitionResponse } from '../../../../../interfaces/Doctor/OrganPetitionResponse.interface';
import { hlaAllele } from '../../../../../interfaces/Coordinator/OrganPostResponse.interface';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-petition-list',
  imports: [RouterLink],
  templateUrl: './petitionList.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetitionList {

  organPetitionService = inject(OrganPetitionService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  petitions = input.required<OrganPetitionResponse[] | null>();
  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();

  shownPetition = signal<number | null>(null);

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
