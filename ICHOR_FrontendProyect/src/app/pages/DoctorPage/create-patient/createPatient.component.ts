import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validator, Validators } from "@angular/forms";
import { CreatePatientService } from '../../../services/CreatePatient.service';
import { Router } from "@angular/router";

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createPatient.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class createPatient {

    patientForm!: FormGroup;
    private http = inject(HttpClient)
    private CreatePatientService = inject(CreatePatientService);

    bloodTypes: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    constructor(private fb: FormBuilder, private router: Router){
        this.initForm();
    }



    initForm(): void {
      this.patientForm = this.fb.group({
        internalID: ['', Validators.required],
        name: ['', Validators.required],
        identification: ['', Validators.required],
        bloodType: ['', Validators.required],
        height: ['', [Validators.required, Validators.min(0)]],
        weight: ['', [Validators.required, Validators.min(0)]],

      });
    }

    onSubmit(): void {

    const { internalID, name, identification, height, weight, bloodType } = this.patientForm.value;
          console.log(bloodType);
    this.CreatePatientService.createPatient(
      internalID,
      name,
      identification,
      bloodType,
      Number(height),
      Number(weight)
    ).subscribe({
      next: (response) => {
        console.log('Patient created successfully:', response);
        this.router.navigate(['/doctor']);
      },
      error: (error) => {
        console.error('Failed to create patient:', error);
      }
    });
  }
  onCancel(): void {
    this.router.navigate(['/doctor']);
  }
}
