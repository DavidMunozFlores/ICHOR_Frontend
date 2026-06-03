import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { OrganPetitionResponse } from '../../../../../interfaces/Doctor/OrganPetitionResponse.interface';
import { PetitionList } from "../../components/petitionList/petitionList";
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';

@Component({
  selector: 'app-draft-petitions',
  imports: [PetitionList],
  templateUrl: './draftPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftPetitions {

  draftPetitions: WritableSignal<OrganPetitionResponse[] | null> = signal<OrganPetitionResponse[] | null>([]);

  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  hasError: WritableSignal<boolean> = signal<boolean>(false);

  private organPetitionService = inject(OrganPetitionService);

  constructor() {
    this.organPetitionService.loadDraftPetitions().subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.hasError.set(!response);
        this.draftPetitions.set(this.organPetitionService.draftPetitions());
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    })
  }

}
