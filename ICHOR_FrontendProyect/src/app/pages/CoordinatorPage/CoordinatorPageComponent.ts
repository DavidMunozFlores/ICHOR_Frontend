import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from "../../components/shared/Header/HeaderComponent";

@Component({
  selector: 'app-coordinator-page-component',
  imports: [HeaderComponent],
  templateUrl: './CoordinatorPageComponent.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoordinatorPageComponent {}
