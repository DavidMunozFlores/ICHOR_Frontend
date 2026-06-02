import { CreateUserResponse } from './../interfaces/CreateUsers/CreateUserResponse';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
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
  API_URL = 'http://localhost:8080/api/v1/hospitals';

  private _hospitals:  WritableSignal<HospitalGetResponse[]> = signal<HospitalGetResponse[]>([]);
  public hospitals = this._hospitals.asReadonly();

  loadHospitals(): Observable<boolean> {
    return this.http.get<HospitalGetResponse[]>(`${this.API_URL}`).pipe(
      switchMap((response: HospitalGetResponse[]) => {
        this._hospitals.set(response);
        return from([true]);
      }),
      catchError((error) => this.handleError(error))
    );
  }

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
        errMessage = 'Error de Front :D';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.errormessage || 'Client side error';
    }

    return throwError(() => new Error(errMessage));
  }
}
