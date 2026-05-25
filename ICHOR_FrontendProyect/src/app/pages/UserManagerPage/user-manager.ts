import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../components/shared/Header/HeaderComponent';

@Component({
  selector: 'app-user-manager',
  imports: [HeaderComponent],
  templateUrl: './user-manager.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManager {}
