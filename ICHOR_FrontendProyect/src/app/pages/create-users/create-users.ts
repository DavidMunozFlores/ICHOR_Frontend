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
    const peticion = {username: username, password: password, id_hospital: Number(hospitals)}
    const url = `http://localhost:8080/api/v1/doctor/create`;
    this.http.post(url, peticion).subscribe({
      next: (response) =>{console.log(response);
      },
      error: (err) => {
        console.error(err)
      }
    })
  }


}
