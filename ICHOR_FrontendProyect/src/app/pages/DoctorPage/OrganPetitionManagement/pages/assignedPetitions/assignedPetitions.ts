import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { PetitionList } from "../../components/petitionList/petitionList";
import { petitionGetResponse } from '../../../../../interfaces/Doctor/petitionGetResponse.interface';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';

@Component({
  selector: 'app-assigned-petitions',
  imports: [PetitionList],
  templateUrl: './assignedPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignedPetitions {

  private organPetitionService = inject(OrganPetitionService);

  assignedPetitions: WritableSignal<petitionGetResponse[] | null> = signal<petitionGetResponse[] | null>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  hasError: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    this.organPetitionService.loadAssignedPetitions().subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.hasError.set(!response);
        this.assignedPetitions.set(this.organPetitionService.assignedPetitions());
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    })
  }

  // TODO! MANEJAR EL ESTADO PARA CUANDO SE HACEN LAS PETICIONES
  // TODO! HACER QUE EN LAS DRAFT SALGA EL COMPONENTE DE EDITAR PARA PODER PONERLA EN WAITING


}
