import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm = this.fb.group({
    organ: ['', [Validators.required]],
    weigth: ['', [Validators.required, Validators.min(1)]],
    volume: ['', [Validators.required, Validators.min(1)]],
    hla: ['', [Validators.required, hlaStringValidator()]],
  })


  onSubmit(){

  }


}
