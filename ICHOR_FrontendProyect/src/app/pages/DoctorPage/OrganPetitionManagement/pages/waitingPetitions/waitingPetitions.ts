import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { PetitionList } from "../../components/petitionList/petitionList";
import { petitionGetResponse } from '../../../../../interfaces/Doctor/petitionGetResponse.interface';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';

@Component({
  selector: 'app-waiting-petitions',
  imports: [PetitionList],
  templateUrl: './waitingPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingPetitions {

  waitingPetitions: WritableSignal<petitionGetResponse[] | null> = signal<petitionGetResponse[] | null>([]);

  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  hasError: WritableSignal<boolean> = signal<boolean>(false);

  private organPetitionService = inject(OrganPetitionService);

  constructor() {
    this.organPetitionService.loadWaitingPetitions().subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.hasError.set(!response);
        this.waitingPetitions.set(this.organPetitionService.waitingPetitions());
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    })
  }
}
