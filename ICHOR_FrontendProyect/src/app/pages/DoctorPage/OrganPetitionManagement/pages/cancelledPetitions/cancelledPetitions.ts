import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { PetitionList } from "../../components/petitionList/petitionList";
import { OrganPetitionResponse } from '../../../../../interfaces/Doctor/OrganPetitionResponse.interface';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';

@Component({
  selector: 'app-cancelled-petitions',
  imports: [PetitionList],
  templateUrl: './cancelledPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelledPetitions {


  cancelledPetitions: WritableSignal<OrganPetitionResponse[] | null> = signal<OrganPetitionResponse[] | null>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  hasError: WritableSignal<boolean> = signal<boolean>(false);

  private organPetitionService = inject(OrganPetitionService);

  constructor() {
    this.organPetitionService.loadCancelledPetitions().subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.hasError.set(!response);
        this.cancelledPetitions.set(this.organPetitionService.cancelledPetitions());
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    })
  }
}
