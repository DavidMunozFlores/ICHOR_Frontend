import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../../../../services/API_URL.const';

@Component({
  selector: 'app-top-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenu {

  router = inject(Router);
  http = inject(HttpClient);
  organPetitionService = inject(OrganPetitionService);

  goToNewPetition(){
    this.router.navigate(['./doctor/create-petition']);
  }

  availableToAssignPetitions = this.organPetitionService.availableToAssignPetitions;





  populatePetitions() {

    this.http.get(`${API_URL}/api/v1/organ-petitions/populate`).subscribe();

  }

}
