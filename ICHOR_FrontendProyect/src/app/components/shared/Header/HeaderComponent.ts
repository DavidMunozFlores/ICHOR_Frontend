import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/AuthService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './HeaderComponent.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

  router = inject(Router);
  role = signal<string | null>(sessionStorage.getItem('role'));

  redirectHome() {
    if(!this.role()){
      this.router.navigate(['/log-in']);
    }else if(this.role() === 'DOCTOR'){
      this.router.navigate(['/doctor']);
    }else if(this.role() === 'MANAGER'){
      this.router.navigate(['/user-manager']);
    }
  }

  private authService = inject(AuthService);

  logOut() {
    this.authService.logOut();
  }

}
