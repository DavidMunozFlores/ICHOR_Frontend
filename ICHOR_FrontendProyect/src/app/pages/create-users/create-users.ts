import { CreateUserService } from './../../services/CreateUser.service';
import { CommonModule } from "@angular/common";
import { Component, EnvironmentInjector, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { CreateUserPost } from '../../interfaces/CreateUsers/CreateUserPost';
import { authCredentials, data, userCreateBody } from '../../interfaces/CreateUsers/CreateUser';
import { UserManager } from '../user-manager/user-manager';

@Component({
  templateUrl: 'create-users.html',
  selector:'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
})

export class createUserComponent implements OnInit {
  userForm!: FormGroup;
  private http = inject(HttpClient);
  createUserService: CreateUserService = inject(CreateUserService)

  hospitals: any[] = [];

  loadHospitals() {
    const url = `${environment.url}/api/v1/hospitales`;
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
    const { name, pass, hospitals } = this.userForm.value
    this.createUserService.CreateUser(name, pass, hospitals, "managerCreator", "1234").subscribe({
      next: (response) =>{console.log(response);
      },
      error: (err) => {
        console.error(err)
      }
    })
  }


}
