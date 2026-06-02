import { CreateUserResponse } from './../interfaces/CreateUsers/CreateUserResponse';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { EncryptDataService } from './EncryptData.service';
import { CreateUserPost } from '../interfaces/CreateUsers/CreateUserPost';
import { data, authCredentials, userCreateBody } from '../interfaces/CreateUsers/CreateUser';


@Injectable({
  providedIn: 'root',
})
export class CreateUserService {
  private encryptData = inject(EncryptDataService);
  private http = inject(HttpClient);
  private URL_API = 'https://41545ad6-a59e-4b93-9fe7-3fa0e135f3c5.mock.pstmn.io/api/v1/doctor/create';
  //private URL_API = 'http://localhost:8080/api/v1/auth/log-in';

  public CreateUser(user: string, pass: string, hospitalID: Number, userManager: string, passManager: string, role: string ): Observable<CreateUserResponse> {
    const credentials: data = { username: user, password: pass, idHospital: hospitalID};
    const authCredentials: authCredentials = {username: userManager, password: passManager};
    const doctorCreateBody: userCreateBody = {authCredentials: authCredentials, data: credentials};

    const url = `http://localhost:8080/api/v1/${role}/create`;



    return from(this.encryptData.encrypt(JSON.stringify(doctorCreateBody))).pipe(

      switchMap((encryptedResult: string) => {

        const body: CreateUserPost = {
          data: encryptedResult
        };


        return this.http.post<CreateUserResponse>(url, body);
      }),

      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: any) {
    let errMessage = 'An error happened.';

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'No se ha podido crear el usuario';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.errormessage || 'Client side error';
    }

    return throwError(() => new Error(errMessage));
  }
}
