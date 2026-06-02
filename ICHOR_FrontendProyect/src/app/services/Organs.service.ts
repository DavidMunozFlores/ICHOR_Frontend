import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { LogInCredentials } from '../interfaces/LogIn/LogInCredentials';
import { OrganPostResponse } from '../interfaces/Coordinator/OrganPostResponse.interface';
import { Organ } from '../interfaces/Coordinator/Organ.interface';


@Injectable({ providedIn: 'root' })
export class OrganServiceService {

  private http = inject(HttpClient);
  // private API_URL = 'http://localhost:8080/api/v1/organs/type-info';
  private API_URL = 'https://41545ad6-a59e-4b93-9fe7-3fa0e135f3c5.mock.pstmn.io/api/v1';

  private _organs: WritableSignal<OrganGetResponse[]> = signal<OrganGetResponse[]>([]);
  public organs = this._organs.asReadonly();

  private _lastOrganSaved = signal({});
  public lastOrganSaved = this._lastOrganSaved.asReadonly();

  loadOrgans(): Observable<boolean> {
    return this.http.get<OrganGetResponse[]>(`${this.API_URL}/organs/type-info`).pipe(
      map(response => this.handleSuccessLoad(response)),
      catchError((error) => this.handleErrorLoad(error))
    )
  }


  saveOrgan(data: Organ): Observable<boolean> {
    const authCredentials: LogInCredentials = {
      username: sessionStorage.getItem('username')!,
      password: sessionStorage.getItem('password')!
    }

    const body = {
      authCredentials: authCredentials,
      data: data
    }

    return this.http.post<OrganPostResponse>(`${this.API_URL}/organs/register-organ`, body).pipe(
      map( response => this.handleSuccessSave(response)),
      catchError( error => this.handleErrorSave(error))
    );
  }


  private handleSuccessLoad(response: OrganGetResponse[]): boolean {
    this._organs.set(response);
    return true;
  }

  private handleSuccessSave( response: OrganPostResponse ): boolean {
    this._lastOrganSaved.set(response);
    return true;
  }

  private handleErrorLoad(error: any) {
    let errMessage = `Unexpected error happened.`;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'Imposible to obtain organ types.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error on get petition to obtain organ types: ', errMessage);

    this._organs.set([]);
    return of(false);
  }

  private handleErrorSave(error: any): Observable<boolean> {

    let errMessage = 'An error occurred saving the organ in the system.';

    if(error instanceof HttpErrorResponse){
      if( error.status === 0 ){
        errMessage = 'Server Error'
      }else if( error.status === 500 ){
        errMessage = 'Impossible to save organ in the system.'
      }
    }else{
      console.log('Client side error saving the organ in the system.');
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error trying to save an organ in the system: ', errMessage);
    this._lastOrganSaved.set({});
    return of(false);

  }



}
