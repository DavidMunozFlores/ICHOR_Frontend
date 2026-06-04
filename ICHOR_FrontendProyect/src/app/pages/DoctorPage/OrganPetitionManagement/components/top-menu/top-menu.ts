import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { OrganPetitionService } from '../../../../../services/OrganPetitions.service';

@Component({
  selector: 'app-top-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenu {

  router = inject(Router);
  organPetitionService = inject(OrganPetitionService);

  goToNewPetition(){
    this.router.navigate(['./doctor/create-petition']);
  }

  availableToAssignPetitions = this.organPetitionService.availableToAssignPetitions;

}
