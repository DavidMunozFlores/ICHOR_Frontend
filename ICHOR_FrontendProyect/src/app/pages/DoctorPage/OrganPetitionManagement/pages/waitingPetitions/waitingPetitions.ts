import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { PetitionList } from "../../components/petitionList/petitionList";
import { petitionGetResponse } from '../../../../../interfaces/Doctor/petitionGetResponse.interface';

@Component({
  selector: 'app-waiting-petitions',
  imports: [PetitionList],
  templateUrl: './waitingPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingPetitions {

    waitingPetitions: WritableSignal<petitionGetResponse[] | null> = signal<petitionGetResponse[] | null>([]);


}
