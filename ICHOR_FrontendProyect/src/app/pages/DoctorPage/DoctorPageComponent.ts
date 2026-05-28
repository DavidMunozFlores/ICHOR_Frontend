import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../components/shared/Header/HeaderComponent';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Patient {
  fullname: string;
  dni: string;
  bloodType: string;
}

@Component({
  selector: 'app-doctor-page-component',
  imports: [HeaderComponent, FormsModule, RouterModule, CommonModule],
  templateUrl: './DoctorPageComponent.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DoctorPageComponent {

  searchBar: string = '';
  patientSelected: Patient | null = null;

  patients: Patient[] = [
    { fullname: 'Juan Pérez Gómez', dni: '12345678X', bloodType: 'A+' },
    { fullname: 'María Rodríguez López', dni: '87654321Y', bloodType: 'O-' },
    { fullname: 'Carlos Sainz Cenoz', dni: '45678912W', bloodType: 'AB+' },
    { fullname: 'Ana Martínez Ruiz', dni: '74185296M', bloodType: 'B-' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  get filteredPatients(): Patient[] {
    if (!this.searchBar.trim()) {
      return this.patients;
    }
    const query = this.searchBar.toLowerCase();
    return this.patients.filter(patient =>
      patient.fullname.toLowerCase().includes(query) ||
      patient.dni.toLowerCase().includes(query)
    );
  }
  selectPatient(patient: Patient): void {
    this.patientSelected = patient;
  }

  goToCreatePatient(): void {
    this.router.navigate(['/patient-create']);
  }
}




