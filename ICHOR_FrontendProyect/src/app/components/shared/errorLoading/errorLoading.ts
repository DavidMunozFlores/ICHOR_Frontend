import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-error-loading',
  imports: [],
  templateUrl: './errorLoading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorLoading {}
