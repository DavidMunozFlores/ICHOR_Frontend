import { CommonModule } from "@angular/common";
import { Component, EnvironmentInjector, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
  templateUrl: 'create-users.html',
  selector:'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
})

export class createUserComponent implements OnInit {
  userForm!: FormGroup;
  private http = inject(HttpClient);

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
      email: [''],
      dni: [''],
      password:[''],
      role: ['doctor'],
      hospitals: [''],

    });
  }
  onSubmit(): void {
    const { username, password, hospitals } = this.userForm.value
    const peticion = {username: username, password: password, id_hospital: Number(hospitals), managerData: {username: "managerCreator", password: "1234"}}
    const url = `https://41545ad6-a59e-4b93-9fe7-3fa0e135f3c5.mock.pstmn.io/api/v1/doctor/create2`;
    this.http.post(url, peticion).subscribe({
      next: (response) =>{console.log(response);
      },
      error: (err) => {
        console.error(err)
      }
    })
  }


}
