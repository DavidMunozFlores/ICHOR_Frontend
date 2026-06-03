import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../../../components/shared/Header/HeaderComponent";

@Component({
  selector: 'app-organ-petition',
  imports: [HeaderComponent],
  templateUrl: './OrganPetition.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganPetition {

  isLoading: WritableSignal<boolean> = signal(true);

}
