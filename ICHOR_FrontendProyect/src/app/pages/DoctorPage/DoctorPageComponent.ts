import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../../components/shared/Header/HeaderComponent';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Patient {
    internalID: string,
    name: string,
    identification: string,
    bloodType: string,
    height: number,
    weight: number,
    idHospital: number

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

  constructor() {
    this.loadPatients();
  }

  goToManagePetitions() {
    this.router.navigate(['/doctor/organ-petitions']);
  }


  searchBar: string = '';
  patientSelected: Patient | null = null;
  patients: Patient[] = [];

loadPatients() {
     this.http.get<Patient[]>(`${environment.url}api/v1/patients`).subscribe(data => {
      this.patients = data;
      this.cdr.markForCheck();
     },

     error => {
      console.error('Error fetching patients:', error);
     });

}

  get filteredPatients(): Patient[] {
    if (!this.searchBar.trim()) {
      return this.patients;
    }
    const query = this.searchBar.toLowerCase();
    return this.patients.filter(patient =>
      patient.name.toLowerCase().includes(query) ||
      patient.identification.toLowerCase().includes(query)
    );
  }
  selectPatient(patient: Patient): void {
    this.patientSelected = patient;
  }

  goToCreatePatient(): void {
    this.router.navigate(['/patient-create']);
  }
}




