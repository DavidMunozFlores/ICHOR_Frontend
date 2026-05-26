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
        fullname: ['', Validators.required],
        dni: ['', Validators.required],
        bloodType: ['', Validators.required]
      });
    }

    onSubmit(): void {
      if (this.patientForm.invalid) return;

      const { fullname, dni, bloodType }= this.patientForm.value;

      const bodyTosend = {
        name: fullname,
        dni: dni,
        blood_type: bloodType
      }
      console.log(bodyTosend);
    }

  }
