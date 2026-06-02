import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../components/shared/Header/HeaderComponent';

@Component({
  selector: 'app-doctor-page-component',
  imports: [HeaderComponent],
  templateUrl: './DoctorPageComponent.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorPageComponent {


}
