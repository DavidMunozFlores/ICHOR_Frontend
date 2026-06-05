import { CreateUserService } from '../../../services/CreateUser.service';
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
    this.createUserService.loadHospitals().subscribe({
      next: (success) => {
        if (success) {
          this.hospitals = this.createUserService.hospitals();
        }
      }
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



    this.createUserService.CreateUser(username, password, hospitals, sessionStorage.getItem('username') ?? '', sessionStorage.getItem('password') ?? '', role).subscribe({
      next: (response) =>{console.log(response);
        this.router.navigate(['/user-manager'], {state: {userCreated: true } });
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
