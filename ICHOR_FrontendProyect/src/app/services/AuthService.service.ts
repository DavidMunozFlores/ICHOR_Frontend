import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { EncryptDataService } from './EncryptData.service';
import { LogInCredentials } from '../interfaces/LogIn/LogInCredentials';
import { LogInPost } from '../interfaces/LogIn/LogInPost';
import { LogInResponse } from '../interfaces/LogIn/LogInResponse';
import { Router } from '@angular/router';
import { routes } from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private encryptData = inject(EncryptDataService);
  private http = inject(HttpClient);
  private router = inject(Router);


  private URL_API = 'https://41545ad6-a59e-4b93-9fe7-3fa0e135f3c5.mock.pstmn.io/api/v1/login';
  // private URL_API = 'http://localhost:8080/api/v1/auth/log-in';

  public login(user: string, pass: string): Observable<LogInResponse> {
    const userTry: LogInCredentials = { username: user, password: pass };



    //TODO! QUITAR ESTO QUE ES GUARRO PARA HACER PRUEBAS
    // return this.http.post<LogInResponse>(this.URL_API,
    //   {
    //     username: user,
    //     password: pass
    //   }
    // ).pipe(catchError(this.handleError));


    //TODO! DESCOMENTAR ESTO PARA QUE LO MANDE ENCRIPTADO
    return from(this.encryptData.encrypt(JSON.stringify(userTry))).pipe(

      switchMap((encryptedResult: string) => {

        const body: LogInPost = {
          data: encryptedResult
        };


        return this.http.post<LogInResponse>(this.URL_API, body);
      }),

      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let errMessage = 'An error happened.';

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 401) {
        errMessage = 'Incorrect username or password';
      } else if(error.status === 404){
        errMessage = 'User does not exists.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.errormessage || 'Client side error';
    }

    return throwError(() => new Error(errMessage));
  }

  public logOut() {

    localStorage.removeItem('username');
    localStorage.removeItem('password');
    sessionStorage.clear();

    this.router.navigate(['/log-in']);


  }
}
