import { CreateUserResponse } from './../interfaces/CreateUsers/CreateUserResponse';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EncryptDataService } from './EncryptData.service';
import { CreateUserPost } from '../interfaces/CreateUsers/CreateUserPost';
import { API_URL } from './API_URL.const';
import { PatientGetResponse } from '../interfaces/CreatePatient/PatientsGetResponse';
import { DoctorResponse } from '../interfaces/CreatePatient/DoctorResponse';


@Injectable({
  providedIn: 'root',
})
export class CreatePatientService {
  private encryptData = inject(EncryptDataService);
  private http = inject(HttpClient);

  private _patients:  WritableSignal<PatientGetResponse[]> = signal<PatientGetResponse[]>([]);
  public patients = this._patients.asReadonly();

  getDoctorByName(name: string): Observable<DoctorResponse> {
    return this.http.get<DoctorResponse>(`${API_URL}/api/v1/doctors/get-by-name/${name}`).pipe(
      catchError((error) => this.handleError(error))
    );
  }


  loadPatients(): Observable<boolean> {

    return this.getDoctorByName(sessionStorage.getItem('username') || '').pipe(
      switchMap((doctor: DoctorResponse) => {
        const targetHospitalId = doctor.hospitalId;

        return this.http.get<PatientGetResponse[]>(`${API_URL}/api/v1/patients`).pipe(
          map((patients: PatientGetResponse[]) => {
            this._patients.set(patients.filter(p => p.idHospital === targetHospitalId));
            return true;
          })
        );
      }),
      catchError((error) => this.handleError(error))
    );
  }

  // public CreateUser(user: string, pass: string, hospitalID: Number, userManager: string, passManager: string, role: string ): Observable<CreateUserResponse> {
  //   const credentials: data = { username: user, password: pass, idHospital: hospitalID};
  //   const authCredentials: authCredentials = {username: userManager, password: passManager};
  //   const doctorCreateBody: userCreateBody = {authCredentials: authCredentials, data: credentials};


  //   return from(this.encryptData.encrypt(JSON.stringify(doctorCreateBody))).pipe(

  //     switchMap((encryptedResult: string) => {

  //       const body: CreateUserPost = {
  //         data: encryptedResult
  //       };


  //       return this.http.post<CreateUserResponse>(`${API_URL}/api/v1/${role}/create`, body);
  //     }),

  //     catchError((error) => this.handleError(error))
  //   );
  // }

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
