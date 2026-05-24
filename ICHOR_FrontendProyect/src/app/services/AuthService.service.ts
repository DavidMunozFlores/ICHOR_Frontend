import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { EncryptDataService } from './EncryptData.service';
import { LogInCredentials } from '../interfaces/LogIn/LogInCredentials';
import { LogInPost } from '../interfaces/LogIn/LogInPost';
import { LogInResponse } from '../interfaces/LogIn/LogInResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private encryptData = inject(EncryptDataService);
  private http = inject(HttpClient);
  private URL_API = 'https://41545ad6-a59e-4b93-9fe7-3fa0e135f3c5.mock.pstmn.io/api/v1/login';

  public login(user: string, pass: string): Observable<LogInResponse> {
    const userTry: LogInCredentials = { name: user, pass: pass };


    return from(this.encryptData.encrypt(JSON.stringify(userTry))).pipe(

      switchMap((encryptedResult: string) => {

        const body: LogInPost = {
          credentialsEncrypted: encryptedResult
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
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.errormessage || 'Client side error';
    }

    return throwError(() => new Error(errMessage));
  }
}
