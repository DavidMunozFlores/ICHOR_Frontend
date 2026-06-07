import { HeaderComponent } from "../../components/shared/Header/HeaderComponent";
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import as from "@angular/common/locales/extra/as";

interface Employee {
  username: string;
  hospitalId: string;
  role: string;
}
@Component({
  selector: 'app-user-manager',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './user-manager.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManager {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  employees: Employee[] = [];
  searchBar: string = '';
  toastMessage: string = '';

  ngOnInit(): void {
    this.loadAllUsers();
  }

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { userCreated?: boolean } | undefined;
    if (state?.userCreated) {
      this.showToast('User created successfully!');
    }
  }

  showToast(message: string, duration = 3000): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = '';
      this.cdr.markForCheck();
    }, duration);
    this.cdr.markForCheck();
  }

  loadAllUsers(): void {
    const urlDoctors = `${environment.url}api/v1/doctors`;
    const urlCoordinators = `${environment.url}api/v1/coordinators`;

    // Usamos <any> para que permita inspeccionar si el backend devuelve un objeto contenedor o una lista directa
    forkJoin({
      doctors: this.http.get<any>(urlDoctors),
      coordinators: this.http.get<any>(urlCoordinators)
    }).subscribe({
      next: ({ doctors, coordinators }) => {
        const rawDoctors = doctors?.data || doctors?.content || doctors;
        const rawCoordinators = coordinators?.data || coordinators?.content || coordinators;
        const finalDoctors = Array.isArray(rawDoctors) ? rawDoctors : [];
        const finalCoordinators = Array.isArray(rawCoordinators) ? rawCoordinators : [];
        const DoctorList = finalDoctors.map((employee: any) => ({ ...employee, role: 'DOCTOR' }));
        const CoordinatorList = finalCoordinators.map((employee: any) => ({ ...employee, role: 'COORDINATOR' }));
        this.employees = [...DoctorList, ...CoordinatorList];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading employees via forkJoin:', err);
      }
    });
  }
  get filteredEmployees(): Employee[] {
    if (!this.searchBar.trim()) {
      return this.employees;
    }
    const query = this.searchBar.toLowerCase();
    return this.employees.filter(emp =>
      emp.username?.toLowerCase().includes(query) ||
      emp.role?.toLowerCase().includes(query)
    );
  }
  redirectToCreate(): void {
    this.router.navigate(['/user-manager/create-users']);
  }






}
