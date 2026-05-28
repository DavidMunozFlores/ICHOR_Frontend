import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../../components/shared/Header/HeaderComponent";
import { FormUtils } from '../../utils/formUtils';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { hlaStringValidator } from '../../utils/hlaValidator';
import { OrganServiceService } from '../../services/Organs.service';


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
  organService = inject(OrganServiceService);
  formUtils = FormUtils;

  isLoading: WritableSignal<boolean> = signal(true);
  hasLoaded: WritableSignal<boolean> = signal(false);
  hasError: WritableSignal<boolean> = signal(false);

  myForm = this.fb.group({
    organ: ['', [Validators.required]],
    weigth: ['', [Validators.required, Validators.min(1)]],
    size: ['', [Validators.required, Validators.min(1)]],
    hla: ['', [Validators.required, hlaStringValidator()]],
  })

  loadOrgans(){
    this.organService.loadOrgans().subscribe({
      next: (success) => {
        this.hasLoaded.set(true);
        this.isLoading.set(false);

        if(success){
          this.hasError.set(false);
        }else{
          this.hasError.set(true);

        }
      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }


  onSubmit(){

  }


}
