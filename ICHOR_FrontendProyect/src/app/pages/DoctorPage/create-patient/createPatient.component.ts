import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validator, Validators } from "@angular/forms";
import { form } from "@angular/forms/signals";
import { groupBy } from "rxjs";


@Component({
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createPatient.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class createPatient implements OnInit{

    patientForm!: FormGroup;
    private http = inject(HttpClient)

    bloodTypes: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    constructor(private fb: FormBuilder){}

    ngOnInit(): void {
      this.initForm();
    }

    initForm(): void {
      this.patientForm = this.fb.group({
        internalID: ['', Validators.required],
        fullname: ['', Validators.required],
        dni: ['', Validators.required],
        bloodType: ['', Validators.required],
        height: ['', [Validators.required, Validators.min(0)]],
        weight: ['', [Validators.required, Validators.min(0)]],
        idHospital: ['', Validators.required],

      });
    }

    onSubmit(): void {

      const { internalID, fullname, dni, bloodType, height, weight}= this.patientForm.value;

      const bodyTosend = {
        internalID: internalID,
        name: fullname,
        dni: dni,
        blood_type: bloodType,
        height: height,
        weight: weight,
      }
      console.log(bodyTosend);
    }

  }
