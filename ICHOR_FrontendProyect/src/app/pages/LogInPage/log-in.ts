import { ChangeDetectionStrategy, Component, signal, WritableSignal, inject, computed, Signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LogInCredentials } from '../../interfaces/LogIn/LogInCredentials';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/AuthService.service';
import { LogInResponse } from '../../interfaces/LogIn/LogInResponse';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../utils/formUtils';

@Component({
  selector: 'app-log-in',
  imports: [ReactiveFormsModule],
  templateUrl: './log-in.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogIn {

  http = inject(HttpClient);
  router = inject(Router);
  authService: AuthService = inject(AuthService);
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  private readonly roleRoutes: Record<string, string> = {
    'MANAGER': '/user-manager',
    'DOCTOR': '/doctor',
    'COORDINATOR': '/coordinator'
  }

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    password: ['', Validators.required]
  });


  errMessage: WritableSignal<string> = signal('');


  private redirect(role: string) {
    const route = this.roleRoutes[role];

    if (route) {
      this.router.navigate([route]);
    }

  }



  private manageError(error: HttpErrorResponse) {

    const statusCode = error.status || error.error?.status;

    switch (statusCode) {
      case 401:
        this.errMessage.set(`User or password incorrect.`);
        break;
      case 404:
        this.errMessage.set(`User does not exists.`);
        break;
      case 0:
        this.errMessage.set(`Check your internet conection.`);
        break;
      default:
        const backendMessage = error.error?.message || `Unexpected server error`;
        this.errMessage.set(`Error ${error.status}: ${backendMessage}`);
    }
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const { name, password } = this.myForm.value;
    this.errMessage.set('');

    // // DESCOMENTAR ESTO --------------------

    // sessionStorage.setItem('username', 'Doctor');
    // sessionStorage.setItem('password', '1234');
    // sessionStorage.setItem('role', 'DOCTOR');
    // this.myForm.reset();
    // this.redirect(sessionStorage.getItem('role')!);


    // // DESCOMENTAR ESTO --------------------

    this.authService.login(name, password)
      .subscribe({
        next: (response: LogInResponse) => {

          const { role } = response;

          sessionStorage.setItem('username', name);
          sessionStorage.setItem('password', password);
          sessionStorage.setItem('role', role)
          this.myForm.reset();
          this.redirect(role);
        },
        error: (err: HttpErrorResponse) => {
          console.log(`Ha habido un error con la petición`);
          this.manageError(err);
        }
      });
  }


}
