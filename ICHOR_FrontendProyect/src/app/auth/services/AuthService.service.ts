import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { EncryptDataService } from '../../services/EncryptData.service';
import { LogInCredentials } from '../../interfaces/LogIn/LogInCredentials';
import { LogInPost } from '../../interfaces/LogIn/LogInPost';
import { LogInResponse } from '../../interfaces/LogIn/LogInResponse';
import { Router } from '@angular/router';
import { routes } from '../../app.routes';

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

    // hacer tu propia construcción de cuerpo a encriptar


    //TODO! DESCOMENTAR ESTO PARA QUE LO MANDE ENCRIPTADO
    return from(this.encryptData.encrypt(JSON.stringify(userTry))).pipe(

      switchMap((encryptedResult: string) => {
        // ---------------------------
        // construcción de datos a mandar
        const body: LogInPost = {
          data: encryptedResult
        };
        //---------------------------------

        // modificación de la url para distintos post
        return this.http.post<LogInResponse>(this.URL_API, body);
      }),

      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any) {
    if(!(error instanceof HttpErrorResponse)){
      console.error('Fatal error on client side: ', error);
      return throwError(() => new Error('Client side crash'));
    }

    console.warn(`Network error captured on service [Status: ${error.status}]`);
    return throwError(() => error);

  }

  public logOut() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('role');
    sessionStorage.clear();

    this.router.navigate(['/log-in']);
  }


  isAuthenticated(): boolean{
    return (
      !!sessionStorage.getItem('username') &&
      !!sessionStorage.getItem('password')
    );
  }

  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

  hasRequiredRole(requiredRole: string): boolean{
    if(!this.getRole()){
      return false;
    }else{
      console.log(`Los roles son iguales? ${this.getRole() === requiredRole}`)
      return this.getRole() === requiredRole;
    }
  }

  getCredentials(): LogInCredentials | null{
    if(this.isAuthenticated()){
      const credentials: LogInCredentials = {
        username: sessionStorage.getItem('username')!,
        password: sessionStorage.getItem('password')!
      }
      return credentials;
    }else{
      return null;
    }
  }


}
