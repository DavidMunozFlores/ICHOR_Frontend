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

  constructor() {
    this.organPetitionService.loadAssignedPetitions().subscribe({
      next: () => {
        this.assignedPetitions.set(this.organPetitionService.assignedPetitions());
      },
      error: () => {

        // TODO! CARGAR MENSAJE ERROR DE CARGA DE PETICIONES

      }
    })
  }
  // TODO! HACER PETICIÓN EN SERVICE
  // TODO! MANEJAR EL ESTADO PARA CUANDO SE HACEN LAS PETICIONES
  // TODO! HACER QUE EN LAS DRAFT SALGA EL COMPONENTE DE EDITAR PARA PODER PONERLA EN WAITING


}
