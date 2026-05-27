import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/shared/Header/HeaderComponent';

@Component({
  selector: 'app-user-manager',
  imports: [HeaderComponent],
  templateUrl: './user-manager.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManager {

  private router = inject(Router);

  redirectToCreate(){
    this.router.navigate(['/create-user']);
  }



}
