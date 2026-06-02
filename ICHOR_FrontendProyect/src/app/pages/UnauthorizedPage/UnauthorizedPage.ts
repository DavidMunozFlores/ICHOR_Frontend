import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized-page',
  imports: [],
  templateUrl: './UnauthorizedPage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedPage {

  router: Router = inject(Router);

  navigate(route: string){
    this.router.navigate([route]);
  }

}
