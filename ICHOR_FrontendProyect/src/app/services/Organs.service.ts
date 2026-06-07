import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { LogInCredentials } from '../interfaces/LogIn/LogInCredentials';
import { OrganPostResponse } from '../interfaces/Coordinator/OrganPostResponse.interface';
import { Organ } from '../interfaces/Coordinator/Organ.interface';
import { API_URL } from './API_URL.const';
import { InfoMessageService } from './InfoMessage.service';
import { OrganPetitionResponse } from '../interfaces/Doctor/OrganPetitionResponse.interface';
import { LogInPost } from '../interfaces/LogIn/LogInPost';
import { EncryptDataService } from './EncryptData.service';


@Injectable({ providedIn: 'root' })
export class OrganService {

  private http = inject(HttpClient);
  infoMessageService = inject(InfoMessageService);
  encryptService = inject(EncryptDataService);


  private _organs: WritableSignal<OrganGetResponse[]> = signal<OrganGetResponse[]>([]);
  public organs = this._organs.asReadonly();

  private _lastOrganSaved = signal({});
  public lastOrganSaved = this._lastOrganSaved.asReadonly();

  loadOrgans(): Observable<boolean> {
    return this.http.get<OrganGetResponse[]>(`${API_URL}/api/v1/organs/type-info`).pipe(
      map(response => this.handleSuccessLoad(response)),
      catchError((error) => this.handleErrorLoad(error))
    )
  }


  saveOrgan(data: Organ): Observable<boolean> {
    const authCredentials: LogInCredentials = {
      username: sessionStorage.getItem('username')!,
      password: sessionStorage.getItem('password')!
    }

    const body1 = {
      authCredentials: authCredentials,
      data: data
    }

    return from(this.encryptService.encrypt(JSON.stringify(body1))).pipe(
      switchMap((encryptedResult: string) => {
        const body2: LogInPost = {
          data: encryptedResult,
        };

        console.log(body2);

        return this.http.post<OrganPostResponse>(`${API_URL}/api/v1/organs/register-organ`, body2).pipe(
          map(response => this.handleSuccessSave(response)),
          catchError(error => this.handleErrorSave(error))
        );
      }),
    );

  }


  private handleSuccessLoad(response: OrganGetResponse[]): boolean {
    this._organs.set(response);
    return true;
  }

  private handleSuccessSave(response: OrganPostResponse): boolean {
    this._lastOrganSaved.set(response);
    console.log('Se supone que he añadido el mensaje de éxito de que se ha creado bien');
    this.infoMessageService.loadSuccess('Organ saved successfully.');
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

    this.infoMessageService.loadError('Ups! Something went wrong loading organ types.');

    this._organs.set([]);
    return of(false);
  }

  private handleErrorSave(error: any): Observable<boolean> {

    let errMessage = 'An error occurred saving the organ in the system.';

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error'
      } else if (error.status === 500) {
        errMessage = 'Impossible to save organ in the system.'
      }
    } else {
      console.log('Client side error saving the organ in the system.');
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error trying to save an organ in the system: ', errMessage);

    this.infoMessageService.loadError('Ups! Something went wrong saving a new organ.');

    this._lastOrganSaved.set({});
    return of(false);

  }



}
