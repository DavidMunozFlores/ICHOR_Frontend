import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { PetitionList } from "../../components/petitionList/petitionList";
import { OrganPetitionResponse } from '../../../../../interfaces/Doctor/OrganPetitionResponse.interface';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';
import { OrganPetitionListUtils } from '../../Utils/OrganPetitionListUtils';

@Component({
  selector: 'app-cancelled-petitions',
  imports: [PetitionList],
  templateUrl: './cancelledPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelledPetitions {

  private organPetitionService = inject(OrganPetitionService);
  petitionListUtils = inject(OrganPetitionListUtils);

  cancelledPetitions = this.organPetitionService.cancelledPetitions;

  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  hasError: WritableSignal<boolean> = signal<boolean>(false);


  constructor() {
    this.petitionListUtils.shownPetition.set(null);
    this.organPetitionService.loadCancelledPetitions().subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.hasError.set(!response);
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    })
  }
}
