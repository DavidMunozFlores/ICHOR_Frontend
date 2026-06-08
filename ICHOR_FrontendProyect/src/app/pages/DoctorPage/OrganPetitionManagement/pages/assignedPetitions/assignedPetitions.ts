import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';

import { PetitionList } from "../../components/petitionList/petitionList";
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';
import { OrganPetitionListUtils } from '../../Utils/OrganPetitionListUtils';

@Component({
  selector: 'app-assigned-petitions',
  imports: [PetitionList],
  templateUrl: './assignedPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignedPetitions {

  private organPetitionService = inject(OrganPetitionService);
  petitionListUtils = inject(OrganPetitionListUtils);

  assignedPetitions = this.organPetitionService.assignedPetitions;

  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  hasError: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    this.petitionListUtils.shownPetition.set(null);
    this.organPetitionService.loadAssignedPetitions().subscribe({
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
