import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { PetitionList } from "../../components/petitionList/petitionList";
import { petitionGetResponse } from '../../../../../interfaces/Doctor/petitionGetResponse.interface';

@Component({
  selector: 'app-cancelled-petitions',
  imports: [PetitionList],
  templateUrl: './cancelledPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelledPetitions {

  cancelledPetitions: WritableSignal<petitionGetResponse[] | null> = signal<petitionGetResponse[] | null>([]);

}
