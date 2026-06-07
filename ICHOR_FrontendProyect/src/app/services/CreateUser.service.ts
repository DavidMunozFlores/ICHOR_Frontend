import { CreateUserResponse } from './../interfaces/CreateUsers/CreateUserResponse';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EncryptDataService } from './EncryptData.service';
import { CreateUserPost } from '../interfaces/CreateUsers/CreateUserPost';
import { data, authCredentials, userCreateBody } from '../interfaces/CreateUsers/CreateUser';
import { API_URL } from './API_URL.const';
import { HospitalGetResponse } from '../interfaces/CreateUsers/HospitalGetResponse.interface';
import { HospitalsResponse } from '../interfaces/CreateUsers/HospitalsResponse';

@Injectable({
  providedIn: 'root',
})
export class CreateUserService {
  private encryptData = inject(EncryptDataService);
  private http = inject(HttpClient);

  private _hospitals:  WritableSignal<HospitalsResponse[]> = signal<HospitalsResponse[]>([]);
  public hospitals = this._hospitals.asReadonly();

  loadHospitals(): Observable<boolean> {
    return this.http.get<HospitalGetResponse>(`${API_URL}/api/v1/hospitals`).pipe(
      switchMap((response: HospitalGetResponse) => {
        this._hospitals.set(response.data);
        return from([true]);
      }),
      catchError((error) => this.handleError(error))
    );
  }

  public CreateUser(user: string, pass: string, hospitalID: Number, userManager: string, passManager: string, role: string ): Observable<CreateUserResponse> {
    const credentials: data = { username: user, password: pass, idHospital: hospitalID};
    const authCredentials: authCredentials = {username: userManager, password: passManager};
    const doctorCreateBody: userCreateBody = {authCredentials: authCredentials, data: credentials};


    return from(this.encryptData.encrypt(JSON.stringify(doctorCreateBody))).pipe(

      switchMap((encryptedResult: string) => {

        const body: CreateUserPost = {
          data: encryptedResult
        };


        return this.http.post<CreateUserResponse>(`${API_URL}/api/v1/${role}/create`, body);
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
        errMessage = 'Error de Front :D';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.errormessage || 'Client side error';
    }

    return throwError(() => new Error(errMessage));
  }
}
