import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cancelled-petitions',
  imports: [],
  templateUrl: './cancelledPetitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelledPetitions {}
