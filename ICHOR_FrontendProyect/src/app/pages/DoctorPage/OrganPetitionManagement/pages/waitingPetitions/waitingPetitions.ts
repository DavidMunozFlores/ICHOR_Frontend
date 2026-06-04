import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { PetitionList } from "../../components/petitionList/petitionList";
import { OrganPetitionResponse } from '../../../../../interfaces/Doctor/OrganPetitionResponse.interface';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';

@Component({
  selector: 'app-waiting-petitions',
  imports: [PetitionList],
  templateUrl: './waitingPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingPetitions {

  private organPetitionService = inject(OrganPetitionService);

  waitingPetitions = this.organPetitionService.waitingPetitions;

  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  hasError: WritableSignal<boolean> = signal<boolean>(false);


  constructor() {
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
