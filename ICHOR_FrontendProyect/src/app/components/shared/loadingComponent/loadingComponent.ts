import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-component',
  imports: [],
  templateUrl: './loadingComponent.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {}
