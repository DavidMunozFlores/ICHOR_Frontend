import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { OrganPetitionResponse } from '../../../../../interfaces/Doctor/OrganPetitionResponse.interface';
import { PetitionList } from "../../components/petitionList/petitionList";
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';
import { OrganPetitionListUtils } from '../../Utils/OrganPetitionListUtils';

@Component({
  selector: 'app-draft-petitions',
  imports: [PetitionList],
  templateUrl: './draftPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftPetitions {

  private organPetitionService = inject(OrganPetitionService);
  petitionListUtils = inject(OrganPetitionListUtils);

  draftPetitions = this.organPetitionService.draftPetitions;

  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  hasError: WritableSignal<boolean> = signal<boolean>(false);


  constructor() {
    this.petitionListUtils.shownPetition.set(null);
    this.organPetitionService.loadDraftPetitions().subscribe({
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
