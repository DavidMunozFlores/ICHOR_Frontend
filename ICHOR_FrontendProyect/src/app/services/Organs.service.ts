import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

interface Organ{
  organType: string,
  organTime: number
}


@Injectable({providedIn: 'root'})
export class OrganServiceService {

  private http = inject(HttpClient);
  // private API_URL = 'http://localhost:8080/api/v1/organs/type-info';
  private API_URL = 'https://41545ad6-a59e-4b93-9fe7-3fa0e135f3c5.mock.pstmn.io/api/v1/organs/type-info';


  private _organs: WritableSignal<Organ[]> = signal<Organ[]>([]);
  public organs = this._organs.asReadonly();

  loadOrgans(): Observable<boolean>{
    return this.http.get<Organ[]>(this.API_URL).pipe(
      map(response => this.handleSuccess(response)),
      catchError( (error) => this.handleError(error))
    )
  }


  private handleSuccess(response: Organ[]){
    this._organs.set(response);
    return true;
  }

  private handleError(error: any) {
    let errMessage = `Unexpected error happened.`;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'Imposible to obtain organ types.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.errormessage || 'Client side error';
    }

    console.error('Catched error on get petition to obtain organ types: ', errMessage);

    this._organs.set([]);
    return of(false);
  }


}
