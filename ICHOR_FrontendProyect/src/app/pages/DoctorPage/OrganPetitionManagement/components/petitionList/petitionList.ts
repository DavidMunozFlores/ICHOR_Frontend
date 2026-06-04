import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { OrganPetitionResponse } from '../../../../../interfaces/Doctor/OrganPetitionResponse.interface';
import { hlaAllele } from '../../../../../interfaces/Coordinator/OrganPostResponse.interface';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { LoadingComponent } from '../../../../../components/shared/loadingComponent/loadingComponent';
import { OrganPetitionListUtils } from '../../Utils/OrganPetitionListUtils';

@Component({
  selector: 'app-petition-list',
  imports: [RouterLink, LoadingComponent],
  templateUrl: './petitionList.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetitionList {

  //organPetitionService = inject(OrganPetitionService);
  petitionListUtils = inject(OrganPetitionListUtils);
  router = inject(Router);
  route = inject(ActivatedRoute);


  petitions = input.required<OrganPetitionResponse[] | null>();
  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();

  // static shownPetition = signal<number | null>(null);

  // static show(idPetition: number) {
  //   if (this.shownPetition() === idPetition) {
  //     this.shownPetition.set(null);
  //   } else {
  //     this.shownPetition.set(idPetition);
  //   }
  // }


  // static showHla(hla: hlaAllele[]): string {
  //   let result = '';
  //   for (let index = 0; index < hla.length; index++) {
  //     result += hla[index].letter + ":" + hla[index].allele + ":" + hla[index].protein + " ";
  //   }
  //   return result.trim();
  // }


  // static acceptPetition(idPetition: number) {
  //   this.organPetitionService.acceptPetition(idPetition).subscribe({
  //     next: (success) => {
  //       console.log('Petition changed status: ', success);
  //       this.organPetitionService.loadDraftPetitions().subscribe();
  //       //todo manejar errores aquí también.
  //     }, error: (err) => {
  //       // todo manejar errores aquí;
  //     }
  //   })
  // }

  // static cancelPetition(idPetition: number) {
  //   this.organPetitionService.cancelPetition(idPetition).subscribe({
  //     next: (success) => {
  //       console.log('Petition changed status: ', success);
  //       this.organPetitionService.loadWaitingPetitions().subscribe();
  //       // todo manejar errores aquí también
  //       this.organPetitionService.loadAssignedPetitions().subscribe();
  //       // todo manejar errores aquí también
  //     }, error: (err) => {
  //       // todo manejar errores aquí;
  //     }
  //   })
  // }

  // static deletePetition(idPetition: number) {
  //   //TODO!
  // }

  // static assingPetition(idPetition: number) {
  //   this.organPetitionService.assingPetition(idPetition).subscribe({
  //     next: (success) => {
  //       console.log('Petition changed status: ', success);
  //       this.organPetitionService.loadWaitingPetitions().subscribe();
  //       // todo manejar errorsitos
  //     }, error: (err) => {
  //       // todo manejar errores aquí;
  //     }
  //   })
  // }
}
