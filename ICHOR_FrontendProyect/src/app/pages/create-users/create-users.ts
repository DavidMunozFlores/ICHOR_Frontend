import { CreateUserService } from './../../services/CreateUser.service';
import { CommonModule } from "@angular/common";
import { Component, EnvironmentInjector, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  templateUrl: 'create-users.html',
  selector:'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
})

export class createUserComponent implements OnInit {
  userForm!: FormGroup;
  private http = inject(HttpClient);
  private router = inject(Router);
  createUserService: CreateUserService = inject(CreateUserService)

  hospitals: any[] = [];

  loadHospitals() {
    const url = `http://localhost:8080/api/v1/hospitals`;
    this.http.get<any[]>(url).subscribe({
      next: data => {this.hospitals = data.map(h => ({ id: h.id, name: h.name }));
    },
    error: (err) => console.error('Error al cargar los hospitales', err)
    });
  }

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.initform();
    this.loadHospitals();
  }

  initform() {
    this.userForm = this.fb.group({
      username: [''],
      password:[''],
      role: ['doctor'],
      hospitals: [''],

    });
  }
  onSubmit(): void {
    const { username, password, hospitals, role } = this.userForm.value



    this.createUserService.CreateUser(username, password, hospitals, "managerCreator", "1234", role).subscribe({
      next: (response) =>{console.log(response);
        this.router.navigate(['/user-manager']);
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  onCancel(): void {
    this.router.navigate(['/user-manager']);
  }


}
