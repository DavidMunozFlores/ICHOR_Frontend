import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-waiting-petitions',
  imports: [],
  templateUrl: './waitingPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitingPetitions {}
