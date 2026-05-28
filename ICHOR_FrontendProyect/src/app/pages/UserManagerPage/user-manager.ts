import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    this.loadEmployees();
  }
  loadEmployees(): void {
    const url = 'http://localhost:8080/api/v1/doctors';

    this.http.get<Employee[]>(url).subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (err) => {
        console.error(err);
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
      emp.hospitalId?.toLowerCase().includes(query) ||
      emp.role?.toLowerCase().includes(query)
    );
  }

  redirectToCreate(){
    this.router.navigate(['/create-users']);
  }



}
