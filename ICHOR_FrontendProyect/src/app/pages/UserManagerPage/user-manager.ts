import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';

interface Employee {
  username: string;
  hospitalId: string;
  role: string;
}
@Component({
  selector: 'app-user-manager',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-manager.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManager {
  private http = inject(HttpClient);
  private router = inject(Router);

  employees: Employee[] = [];
  searchBar: string = '';

  ngOnInit(): void {
    this.loadAllUsers();
  }
  constructor () {this.loadAllUsers();
}

  loadAllUsers(): void {
    const urlDoctors =`${environment.url}api/v1/doctors`;
    const urlCoordinators = `${environment.url}api/v1/doctors`;

    forkJoin ({
      doctors: this.http.get<Employee[]>(urlDoctors),
      coordinators: this.http.get<Employee[]>(urlCoordinators)
    }).subscribe({
        next: ({doctors, coordinators}) => {
          const DoctorList = doctors.map(employee => ({...employee, role: 'DOCTOR'}))
          const CoordinatorList = coordinators.map(employee => ({...employee, role: 'COORDINATOR'}))
          this.employees = [...DoctorList, ...CoordinatorList];
        },
        error: (err) => {console.error(err)}
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

  redirectToCreate(){
    this.router.navigate(['/create-users']);
  }



}
