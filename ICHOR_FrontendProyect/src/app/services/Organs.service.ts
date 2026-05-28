import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

interface Organ{
  organType: string,
  organTime: number
}


@Injectable({providedIn: 'root'})
export class ServiceNameService {

  private http = inject(HttpClient);
  // private API_URL = 'http://localhost:8080/api/v1/organs/type-info';
  private API_URL = 'https://41545ad6-a59e-4b93-9fe7-3fa0e135f3c5.mock.pstmn.io/api/v1/organs/type-info';




  loadOrgans(): Observable<boolean>{

    return this.http.get<Organ[]>(this.API_URL).pipe(

      map(response => this.handleSuccess(response)),
      catchError( (error) => this.handleError(error))

    )

  }


  private handleSuccess(response: Organ[]){

    // supongo que debería asignar los órganos aquí pero no sé como xd

    return true;
  }

  private handleError(error: any) {
    if(!(error instanceof HttpErrorResponse)){
      console.error('Fatal error on client side: ', error);
      throwError(() => new Error('Client side crash'));
      return of(false);
    }

    console.warn(`Network error captured on service [Status: ${error.status}]`);
    throwError(() => error);
    return of(false);
  }





  //constructor() { }

}
