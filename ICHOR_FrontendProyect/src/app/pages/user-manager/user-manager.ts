import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-manager',
  imports: [],
  templateUrl: './user-manager.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManager {}
