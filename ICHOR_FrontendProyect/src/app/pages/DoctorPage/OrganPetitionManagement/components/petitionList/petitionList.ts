import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { petitionGetResponse } from '../../../../../interfaces/Doctor/petitionGetResponse.interface';

@Component({
  selector: 'app-petition-list',
  imports: [],
  templateUrl: './petitionList.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetitionList {

  petitions = input.required<petitionGetResponse[] | null>();

}
