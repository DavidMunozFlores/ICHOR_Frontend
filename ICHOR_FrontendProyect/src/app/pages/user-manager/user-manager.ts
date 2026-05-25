import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-manager',
  imports: [],
  templateUrl: './user-manager.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManager {

  private router = inject(Router);

  redirectToCreate(){
    this.router.navigate(['/create-user']);
  }



}
