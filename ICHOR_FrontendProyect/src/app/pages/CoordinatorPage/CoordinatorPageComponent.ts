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
  isVerified: WritableSignal<boolean> = signal(false);

  countdown: WritableSignal<number> = signal(10);
  canSubmit: WritableSignal<boolean> = signal(false);
  private timerInterval: any;

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
        this.hasError.set(!success);

      },
      error: () => {
        this.isLoading.set(false);
        this.hasError.set(true);
      }
    });
  }


  onSubmit(){
    if(!this.canSubmit()){
      return;
    }

    //TODO! AQUI VA EL POST DEL ORGANO
    console.log(this.myForm.value);
  }

  showVerification(){
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched;
      return;
    }

    this.countdown.set(10);
    this.canSubmit.set(false);
    this.isVerified.set(true);


    this.timerInterval = setInterval( () => {
      this.countdown.update((v) => v-1);

      if(this.countdown() <= 0){
        this.canSubmit.set(true);
        clearInterval(this.timerInterval) // rarete autoreferencia para pararse a sí mismo pero funka bien
      }
    }, 1000)
  }


  cancelVerification(){
    this.isVerified.set(false);
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
  }




}
