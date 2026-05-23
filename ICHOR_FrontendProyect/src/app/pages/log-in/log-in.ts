import { ChangeDetectionStrategy, Component, signal, WritableSignal, inject, computed, Signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LogInCredentials } from '../../interfaces/LogIn/LogInCredentials';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService.service';

@Component({
  selector: 'app-log-in',
  imports: [],
  templateUrl: './log-in.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogIn {

  http = inject(HttpClient);
  router = inject(Router);
  authService: AuthService = inject(AuthService);


  name: WritableSignal<string> = signal('');
  pass: WritableSignal<string> = signal('');

  //TODO! MANEJAR ESTO CON FORMULARIOS REACTIVOS
  errMessage: WritableSignal<string> = signal('');


  userTry: Signal<LogInCredentials> = computed(() => {
    const user: LogInCredentials = {
      name: this.name(),
      pass: this.pass()
    };

    return user;
  });

  logUser() {

    console.log(this.userTry().name, this.userTry().pass, JSON.stringify(this.userTry()));

    this.authService.login(this.userTry().name, this.userTry().pass)
      .subscribe({
        next: (response) => {
          this.redirect(response.role);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.manageError(err);
        }
      })


    this.clear();
  }

  clear() {
    this.name.set('');
    this.pass.set('');
  }



  private redirect(role: string) {
    if (role === 'USER_MANAGER') {
      this.router.navigateByUrl('/user-manager');
    } else if (role === 'DOCTOR') {
      //  TODO!
    } else if (role === 'COORDINATOR') {
      // TODO!
    }
  }



  private manageError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.errMessage.set('User or password incorrect');
    } else {
      this.errMessage.set('Server error');
    }
  }


}
