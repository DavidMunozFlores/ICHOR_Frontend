import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from "../../../components/shared/Header/HeaderComponent";
import { LoadingComponent } from "../../../components/shared/loadingComponent/loadingComponent";
import { ErrorLoading } from "../../../components/shared/errorLoading/errorLoading";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganPetitionService } from '../../../services/OrganPetitions.service';
import { FormUtils } from '../../../utils/formUtils';
import { hlaStringValidator } from '../../../utils/hlaValidator';
import { OrganService } from '../../../services/Organs.service';
import { KeyValuePipe } from '@angular/common';
import { IOrganPetition } from '../../../interfaces/Doctor/IOrganPetition.interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-organ-petition',
  imports: [HeaderComponent, LoadingComponent, ErrorLoading, KeyValuePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './OrganPetition.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganPetition {

private fb = inject(FormBuilder);
  organPetitionService = inject(OrganPetitionService);
  organService = inject(OrganService);
  formUtils = FormUtils;

  // username: WritableSignal<string> = signal(sessionStorage.getItem('username')!);
  bloodTypes: WritableSignal<string[]> = signal(['A+','A-','B+','B-','O+','O-','AB+','AB-']);

  isLoading: WritableSignal<boolean> = signal(true);
  hasLoaded: WritableSignal<boolean> = signal(false);
  hasError: WritableSignal<boolean> = signal(false);
  isVerified: WritableSignal<boolean> = signal(false);
  isSavingPetition:WritableSignal<boolean> = signal(false);

  countdown: WritableSignal<number> = signal(10);
  canSubmit: WritableSignal<boolean> = signal(false);
  private timerInterval: any;

  constructor(){

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


  myForm = this.fb.group({
    idPatient: [, [Validators.required, Validators.min(1)]],
    organ: [, [Validators.required]],
    weigth: ['', [Validators.required, Validators.min(10), Validators.max(4000)]],
    volume: ['', [Validators.required, Validators.min(10), Validators.max(4000)]],
    hla: ['', [Validators.required, hlaStringValidator()]],
  })

  showVerification(){
    if(this.myForm.invalid){
      this.myForm.markAllAsTouched();
      return;
    }

    this.countdown.set(5);
    this.canSubmit.set(false);
    this.isVerified.set(true);


    this.timerInterval = setInterval( () => {
      this.countdown.update((v) => v-1);

      if(this.countdown() <= 0){
        this.canSubmit.set(true);
        clearInterval(this.timerInterval)
      }
    }, 1000)
  }


   cancelVerification(){
    this.isVerified.set(false);
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
  }

  onSubmit(){
      if(!this.canSubmit()){
        return;
      }

      const petition: IOrganPetition = {
        idPatient: this.myForm.controls.idPatient.value!,
        organType:this.myForm.controls.organ.value!,
        weightGrams: Number(this.myForm.controls.weigth.value),
        volumeCC: Number(this.myForm.controls.volume.value!),
        hla: this.myForm.controls.hla.value!
      }


      console.log(petition);

      this.organPetitionService.savePetition(petition).subscribe({
        next: (success) => {
          this.isSavingPetition.set(true);
          //TODO! REDIRECT TO PETITION MANAGEMENT
          //window.location.reload();
        },
        error: (error) => {
          this.hasError.set(true);

        }
      });

    }
}
