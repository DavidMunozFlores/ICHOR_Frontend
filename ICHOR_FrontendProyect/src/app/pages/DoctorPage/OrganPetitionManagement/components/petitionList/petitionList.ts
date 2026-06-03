import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { OrganPetitionResponse } from '../../../../../interfaces/Doctor/OrganPetitionResponse.interface';

@Component({
  selector: 'app-petition-list',
  imports: [],
  templateUrl: './petitionList.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetitionList {

  petitions = input.required<OrganPetitionResponse[] | null>();
  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();

}
