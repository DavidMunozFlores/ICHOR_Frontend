import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { PetitionList } from "../../components/petitionList/petitionList";
import { petitionGetResponse } from '../../../../../interfaces/Doctor/petitionGetResponse.interface';

@Component({
  selector: 'app-assigned-petitions',
  imports: [PetitionList],
  templateUrl: './assignedPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignedPetitions {


  assignedPetitions: WritableSignal<petitionGetResponse[]> = signal<petitionGetResponse[]>([]);

  // TODO! HACER PETICIÓN EN SERVICE
  // TODO! MANEJAR EL ESTADO PARA CUANDO SE HACEN LAS PETICIONES
  // TODO! HACER QUE EN LAS DRAFT SALGA EL COMPONENTE DE EDITAR PARA PODER PONERLA EN WAITING


}
