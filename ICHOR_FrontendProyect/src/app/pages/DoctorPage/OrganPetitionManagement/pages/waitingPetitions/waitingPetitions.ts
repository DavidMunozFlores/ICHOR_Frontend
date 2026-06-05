import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';
import { LoadingComponent } from "../../../../../components/shared/loadingComponent/loadingComponent";
import { OrganPetitionListUtils } from '../../Utils/OrganPetitionListUtils';

@Component({
  selector: 'app-waiting-petitions',
  imports: [LoadingComponent],
  templateUrl: './waitingPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingPetitions {

  private organPetitionService = inject(OrganPetitionService);
  petitionListUtils = inject(OrganPetitionListUtils);
  petitionList = OrganPetitionListUtils;

  petitions = this.organPetitionService.waitingPetitions;

  petitionsAvailableAssign = this.organPetitionService.availableToAssignPetitions;
  petitionsUnavailableAssign = this.organPetitionService.unavailableToAssignPetitions;

  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  hasError: WritableSignal<boolean> = signal<boolean>(false);


  constructor() {
    this.petitionListUtils.shownPetition.set(null);
    this.organPetitionService.loadWaitingPetitions().subscribe({
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
