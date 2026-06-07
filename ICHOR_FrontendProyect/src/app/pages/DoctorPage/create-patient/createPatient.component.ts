import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CreatePatientService } from '../../../services/CreatePatient.service';
import { Router } from "@angular/router";
import { HeaderComponent } from "../../../components/shared/Header/HeaderComponent";

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './createPatient.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePatientComponent {

  patientForm!: FormGroup;
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);
  private createPatientService = inject(CreatePatientService);
  public cdr = inject(ChangeDetectorRef);

  errorMessage: string = '';
  bloodTypes: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  readonly NAME_REGEX = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{10,50}$/;

  constructor() {
    this.initForm();
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      internalID: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(this.NAME_REGEX)]],
      identification: ['', Validators.required],
      bloodType: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(10), Validators.max(250)]],
      weight: ['', [Validators.required, Validators.min(2), Validators.max(400)]],
    });
  }

  onSubmit(): void {
    if (this.patientForm.invalid) return;

    this.errorMessage = ''; // Limpiamos residuos de errores anteriores
    const { internalID, name, identification, height, weight, bloodType } = this.patientForm.value;

    this.createPatientService.createPatient(
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
      error: (err: Error) => {
        this.errorMessage = err.message;

        this.cdr.markForCheck();
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/doctor']);
  }
}
