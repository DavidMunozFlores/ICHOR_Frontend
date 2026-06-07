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
import { API_URL } from '../../services/API_URL.const';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private encryptData = inject(EncryptDataService);
  private http = inject(HttpClient);
  private router = inject(Router);


  public login(user: string, pass: string): Observable<LogInResponse> {
    const userTry: LogInCredentials = { username: user, password: pass };


    return from(this.encryptData.encrypt(JSON.stringify(userTry))).pipe(
      switchMap((encryptedResult: string) => {
        const body: LogInPost = {
          data: encryptedResult
        };
        return this.http.post<LogInResponse>(`${API_URL}/api/v1/auth/log-in`, body);
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
