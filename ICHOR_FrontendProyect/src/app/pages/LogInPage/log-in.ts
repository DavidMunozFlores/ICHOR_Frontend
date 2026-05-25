import { ChangeDetectionStrategy, Component, signal, WritableSignal, inject, computed, Signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LogInCredentials } from '../../interfaces/LogIn/LogInCredentials';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService.service';
import { LogInResponse } from '../../interfaces/LogIn/LogInResponse';

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
      username: this.name(),
      password: this.pass()
    };

    return user;
  });

  logUser() {
    this.errMessage.set('');

    console.log('entrando al método de logUser()');

    console.log(this.userTry().username, this.userTry().password, JSON.stringify(this.userTry()));

    this.authService.login(this.userTry().username, this.userTry().password)
      .subscribe({
        next: (response:LogInResponse) => {
          sessionStorage.setItem('try','tryValue');
          this.saveCredentials();
          this.redirect(response.rol);
          console.log('todo ha ido bien y redirijo')
          this.clear();
        },
        error: (err: HttpErrorResponse) => {
          console.log('Ha habido un error con la petición al http y ahora digo cual es.')
          console.log(err.message);
          this.manageError(err);
          this.clear();
        }
      });
  }


  saveCredentials() {
    sessionStorage.setItem('username',this.name());
    sessionStorage.setItem('password',this.pass());
  }

  clear() {
    this.name.set('');
    this.pass.set('');
  }



  private redirect(role: string) {
    if (role === 'MANAGER') {
      this.router.navigate(['/user-manager']);
    } else if (role === 'DOCTOR') {
      this.router.navigate(['/doctor-page']);
    } else if (role === 'COORDINATOR') {
      this.router.navigate(['/coordinator-page']);
    }
  }



  private manageError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.errMessage.set('User or password incorrect.');
    }else if(error.status === 404){
      this.errMessage.set('User not exists.')
    } else {
      this.errMessage.set('Server error');
    }
  }


}
