import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { OrganPetitionResponse } from '../../../../../interfaces/Doctor/OrganPetitionResponse.interface';
import { hlaAllele } from '../../../../../interfaces/Coordinator/OrganPostResponse.interface';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { LoadingComponent } from '../../../../../components/shared/loadingComponent/loadingComponent';
import { OrganPetitionListUtils } from '../../Utils/OrganPetitionListUtils';

@Component({
  selector: 'app-petition-list',
  imports: [RouterLink, LoadingComponent],
  templateUrl: './petitionList.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetitionList {

  petitionListUtils = inject(OrganPetitionListUtils);
  router = inject(Router);
  route = inject(ActivatedRoute);


  petitions = input.required<OrganPetitionResponse[] | null>();
  isLoading = input.required<boolean>();
  hasError = input.required<boolean>();


}
