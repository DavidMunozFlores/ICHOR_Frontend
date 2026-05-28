import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../../components/shared/Header/HeaderComponent";
import { FormUtils } from '../../utils/formUtils';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { hlaStringValidator } from '../../utils/hlaValidator';


@Component({
  selector: 'app-coordinator-page-component',
  imports: [HeaderComponent, ReactiveFormsModule],
  templateUrl: './CoordinatorPageComponent.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoordinatorPageComponent {

  constructor(){
    this.loadOrgans();
  }

  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  isLoading: WritableSignal<boolean> = signal(true);
  hasLoading: WritableSignal<boolean> = signal(false);

  organs: WritableSignal<Organ[]> = signal([]);

  myForm = this.fb.group({
    organ: ['', [Validators.required]],
    weigth: ['', [Validators.required, Validators.min(1)]],
    volume: ['', [Validators.required, Validators.min(1)]],
    hla: ['', [Validators.required, hlaStringValidator()]],
  })

  loadOrgans(){
    // tengo que hacer la petición al back y que me devuelva una lista de objetos de los organos
    // y yo la carge en la signal organs



  }


  onSubmit(){

  }


}
