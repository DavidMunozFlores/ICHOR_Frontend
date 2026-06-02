import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../../components/shared/Header/HeaderComponent";
import { FormUtils } from '../../utils/formUtils';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { hlaStringValidator } from '../../utils/hlaValidator';
import { OrganServiceService } from '../../services/Organs.service';
import { Organ } from '../../interfaces/Coordinator/Organ.interface';


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

  username: WritableSignal<string> = signal(sessionStorage.getItem('username')!);
  bloodTypes: WritableSignal<string[]> = signal(['A+','A-','B+','B-','O+','O-','AB+','AB-']);

  isLoading: WritableSignal<boolean> = signal(true);
  hasLoaded: WritableSignal<boolean> = signal(false);
  hasError: WritableSignal<boolean> = signal(false);
  isVerified: WritableSignal<boolean> = signal(false);
  isSavingOrgan:WritableSignal<boolean> = signal(false);

  countdown: WritableSignal<number> = signal(10);
  canSubmit: WritableSignal<boolean> = signal(false);
  private timerInterval: any;

  myForm = this.fb.group({
    organ: [, [Validators.required]],
    blood: [, [Validators.required]],
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

    const organ: Organ = {
      organType: this.myForm.controls.organ.value!,
      bloodType:this.myForm.controls.blood.value!,
      weightGrams: Number(this.myForm.controls.weigth.value),
      volumeCC: Number(this.myForm.controls.size.value!),
      hla: this.myForm.controls.hla.value!
    }

    console.log(organ);
    this.organService.saveOrgan(organ).subscribe({
      next: (success) => {
        this.isSavingOrgan.set(true);
        //window.location.reload();
      },
      error: (error) => {
        this.hasError.set(true);

      }
    });

  }

  showVerification(){
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();
      console.log('has clicado en el boton de ver resumen');
      return;
    }

    this.countdown.set(5);
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
