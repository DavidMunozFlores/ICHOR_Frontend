import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../services/AuthService.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './HeaderComponent.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

  private authService = inject(AuthService);

  logOut(){
    this.authService.logOut();
  }

}
