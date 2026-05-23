import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { EncryptDataService } from './EncryptData.service';
import { LogInCredentials } from '../interfaces/LogIn/LogInCredentials';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LogInPost } from '../interfaces/LogIn/LogInPost';
import { LogInResponse } from '../interfaces/LogIn/LogInResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  encryptData: EncryptDataService = inject(EncryptDataService);
  http: HttpClient = inject(HttpClient);
  URL_API: string = 'http://localhost:8080/api/v1/login';


  public login(user: string, pass: string): Observable<LogInResponse> {

    const userTry: LogInCredentials = {
      name: user,
      pass: pass
    }

    const encryptedUser: WritableSignal<string> = signal('');
    const errMessage: WritableSignal<string> = signal('');

    const encrypt = this.encryptData.encrypt(JSON.stringify(userTry));

    encrypt.then(
      (response) => {
        encryptedUser.set(response);
      },
    ).catch(
      (error) => {
        errMessage.set(error);
        throw new Error(`An error happened encrypting the data: ${errMessage()}`);
      }
    );

    const body: LogInPost = {
      credentialsEncrypted: encryptedUser()
    }

    return this.http.post<LogInResponse>(this.URL_API, body);

  }


}


