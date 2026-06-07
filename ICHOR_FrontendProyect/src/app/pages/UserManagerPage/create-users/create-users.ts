import { CreateUserService } from '../../../services/CreateUser.service';
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EnvironmentInjector, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import {Validators} from "@angular/forms";

@Component({
  templateUrl: 'create-users.html',
  selector:'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class createUserComponent implements OnInit {
  userForm!: FormGroup;
  private http = inject(HttpClient);
  private router = inject(Router);
  createUserService: CreateUserService = inject(CreateUserService)
  public cdr = inject(ChangeDetectorRef);
  errorMessage: string = '';

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
  readonly USERNAME_REGEX = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžæÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{10,50}$/;
  readonly PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,127}$/;

  initform() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(this.USERNAME_REGEX)]],
      password:['', [Validators.required, Validators.pattern(this.PASSWORD_REGEX)]],
      role: ['doctor'],
      hospitals: ['', Validators.required],

    });
  }
  onSubmit(): void {
    if (!this.userForm.valid) return;
    this.errorMessage = '';
    const { username, password, hospitals, role } = this.userForm.value

    this.createUserService.CreateUser(username, password, hospitals, sessionStorage.getItem('username') ?? '', sessionStorage.getItem('password') ?? '', role).subscribe({
      next: (response) =>{console.log(response);
        this.router.navigate(['/user-manager'], {state: {userCreated: true } });
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.cdr.markForCheck();
      }
    })
  }
  onCancel(): void {
    this.router.navigate(['/user-manager']);
  }


}
