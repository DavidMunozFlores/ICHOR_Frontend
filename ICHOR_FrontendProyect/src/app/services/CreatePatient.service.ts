import { CreateUserResponse } from './../interfaces/CreateUsers/CreateUserResponse';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EncryptDataService } from './EncryptData.service';
import { CreateUserPost } from '../interfaces/CreateUsers/CreateUserPost';
import { API_URL } from './API_URL.const';
import { PatientGetResponse, PatientsApiResponse } from '../interfaces/CreatePatient/PatientsGetResponse';
import { DoctorResponse } from '../interfaces/CreatePatient/DoctorResponse';
import { CreatePatientResponse } from '../interfaces/CreatePatient/PatientCreateResponse';


@Injectable({
  providedIn: 'root',
})
export class CreatePatientService {
  private encryptData = inject(EncryptDataService);
  private http = inject(HttpClient);

  private _patients:  WritableSignal<PatientGetResponse[]> = signal<PatientGetResponse[]>([]);
  public patients = this._patients.asReadonly();

  getDoctorByName(name: string): Observable<DoctorResponse[]> {
    return this.http.get<DoctorResponse[]>(`${API_URL}/api/v1/doctors/get-by-name/${name}`).pipe(
      catchError((error) => this.handleError(error))
    );
  }


  loadPatients(): Observable<boolean> {

    return this.getDoctorByName(sessionStorage.getItem('username') || '').pipe(
      switchMap((doctors: DoctorResponse[]) => {
        const doctor = doctors[0];
        const targetHospitalId = doctor.hospitalId;

        return this.http.get<PatientsApiResponse>(`${API_URL}/api/v1/patients`).pipe(
          map((response: PatientsApiResponse) => {

            const rawPatients = response.data;
            this._patients.set(rawPatients.filter(p => p.idHospital === targetHospitalId));
            return true;
          })
        );
      }),
      catchError((error) => this.handleError(error))
    );
  }

  public createPatient(InternalID: string,name: string, identification: string, bloodType: string, height: number, weight: number): Observable<CreatePatientResponse> {
    const username = sessionStorage.getItem('username') || '';
    const password = sessionStorage.getItem('password') || '';
    return this.getDoctorByName(sessionStorage.getItem('username') || '').pipe(
      switchMap((doctors: DoctorResponse[]) => {
        const doctor = doctors[0];
        const targetHospitalId: number = doctor.hospitalId;
        const patientData = {
          internalID: InternalID,
          name: name,
          identification: identification,
          bloodType: bloodType,
          height: height,
          weight: weight,
          idHospital: targetHospitalId
        }
        const authCredentials = { username: username, password: password };
        const patientCreateBody = { authCredentials: authCredentials, data: patientData };
        console.log(patientCreateBody);
        return from(this.encryptData.encrypt(JSON.stringify(patientCreateBody))).pipe(
          switchMap((encryptedResult: string) => {
            const body: CreateUserPost = {
              data: encryptedResult
            };
            return this.http.post<CreatePatientResponse>(`${API_URL}/api/v1/patients/create`, body).pipe(
              catchError((error) => this.handleError(error))
            );
          }),
          catchError((error) => this.handleError(error))
        );
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
      } else if (error.status === 409) {
        errMessage = 'Patient already exists';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.errormessage || 'Client side error';
    }

    return throwError(() => new Error(errMessage));
  }
}
