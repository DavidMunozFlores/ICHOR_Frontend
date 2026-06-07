import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../../components/shared/Header/HeaderComponent';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {CreatePatientService} from '../../services/CreatePatient.service';

interface Patient {
  idPatient: number;
  internalID: string;
  name: string;
  identification: string;
  bloodType: string;
  height: number;
  weight: number;
  idHospital: number;
  organPetitions: any[];
}



@Component({
  selector: 'app-doctor-page-component',
  imports: [HeaderComponent, FormsModule, RouterModule, CommonModule],
  templateUrl: './DoctorPageComponent.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DoctorPageComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private createPatientService = inject(CreatePatientService);

  constructor() {
    this.loadPatients();
  }

  goToManagePetitions() {
    this.router.navigate(['/doctor/organ-petitions']);
  }
  goToCreatePatient() {
    this.router.navigate(['/doctor/create-patient']);
  }


  searchBar: string = '';
  patientSelected: Patient | null = null;
  patients: Patient[] = [];

loadPatients() {
     this.createPatientService.loadPatients().subscribe({
       next: (success) => {
         if (success) {
          console.log('Patients loaded successfully');
          this.cdr.markForCheck();
         }
       },
       error: (error) => {
         console.error('Error fetching patients:', error);
       }
     });

}

get filteredPatients(): Patient[] {
    const currentPatients = this.createPatientService.patients() as unknown as Patient[];

    if (!this.searchBar.trim()) {
      return currentPatients;
    }

    const query = this.searchBar.toLowerCase();
    return currentPatients.filter(patient =>
      patient.name.toLowerCase().includes(query) ||
      patient.identification.toLowerCase().includes(query)
    );
  }

  selectPatient(patient: Patient): void {
    this.patientSelected = patient;
  }
}




