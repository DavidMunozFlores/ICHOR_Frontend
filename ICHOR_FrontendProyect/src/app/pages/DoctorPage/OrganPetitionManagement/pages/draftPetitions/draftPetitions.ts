import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { petitionGetResponse } from '../../../../../interfaces/Doctor/petitionGetResponse.interface';
import { PetitionList } from "../../components/petitionList/petitionList";

@Component({
  selector: 'app-draft-petitions',
  imports: [PetitionList],
  templateUrl: './draftPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftPetitions {

  draftPetitions: WritableSignal<petitionGetResponse[] | null> = signal<petitionGetResponse[] | null>([]);


}
