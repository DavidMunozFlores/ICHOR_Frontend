import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { OrganPetitionResponse } from '../interfaces/Doctor/OrganPetitionResponse.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LogInCredentials } from '../interfaces/LogIn/LogInCredentials';
import { IOrganPetition } from '../interfaces/Doctor/IOrganPetition.interface';
import { OrganPetitionPost } from '../interfaces/Doctor/OrganPetitionPost.interface';
import { API_URL } from './API_URL.const';


@Injectable({ providedIn: 'root' })
export class OrganPetitionService {

  private http = inject(HttpClient);


  private _draftPetitions: WritableSignal<OrganPetitionResponse[]> = signal<OrganPetitionResponse[]>([]);
  draftPetitions = this._draftPetitions.asReadonly();

  private _cancelledPetitions: WritableSignal<OrganPetitionResponse[]> = signal<OrganPetitionResponse[]>([]);
  cancelledPetitions = this._cancelledPetitions.asReadonly();

  private _waitingPetitions: WritableSignal<OrganPetitionResponse[]> = signal<OrganPetitionResponse[]>([]);
  waitingPetitions = this._waitingPetitions.asReadonly();

  private _assignedPetitions: WritableSignal<OrganPetitionResponse[]> = signal<OrganPetitionResponse[]>([]);
  assignedPetitions = this._assignedPetitions.asReadonly();

  private _lastPetitionSaved = signal({});
  lastPetitionSaved = this._lastPetitionSaved.asReadonly();

  savePetition(data: IOrganPetition) {

    const credentials: LogInCredentials = {
      username: sessionStorage.getItem('username')!,
      password: sessionStorage.getItem('password')!,
    }

    const body: OrganPetitionPost = {
      authCredentials: credentials,
      data: data
    }

    return this.http.post<OrganPetitionResponse>(`${API_URL}/api/v1/organ-petitions/create`, body).pipe(
      map(response => this.handleSuccessSave(response)),
      catchError(error => this.handleErrorSave(error))
    )

  }



  loadDraftPetitions(): Observable<boolean> {
    return this.http.get<OrganPetitionResponse[]>(`${API_URL}/api/v1/organ/petition/draft`).pipe(
      map(draftPetitions => this.handleSuccessLoad(draftPetitions, this._draftPetitions)),
      catchError(error => this.handleErrorLoad(error, this._draftPetitions))
    )
  }

  loadAssignedPetitions(): Observable<boolean> {
    return this.http.get<OrganPetitionResponse[]>(`${API_URL}/api/v1/organ/petition/asigned`).pipe(
      map(assignedPetitions => this.handleSuccessLoad(assignedPetitions, this._assignedPetitions)),
      catchError(error => this.handleErrorLoad(error, this._assignedPetitions))
    )
  }

  loadCancelledPetitions(): Observable<boolean> {
    return this.http.get<OrganPetitionResponse[]>(`${API_URL}/api/v1/organ/petition/cancelled`).pipe(
      map(cancelledPetitions => this.handleSuccessLoad(cancelledPetitions, this._cancelledPetitions)),
      catchError(error => this.handleErrorLoad(error, this._cancelledPetitions))
    )
  }

  loadWaitingPetitions(): Observable<boolean> {
    return this.http.get<OrganPetitionResponse[]>(`${API_URL}/api/v1/organ/petition/waiting`).pipe(
      map(waitingPetitions => this.handleSuccessLoad(waitingPetitions, this._waitingPetitions)),
      catchError(error => this.handleErrorLoad(error, this._waitingPetitions))
    )
  }


  private handleSuccessLoad(draftPetitions: OrganPetitionResponse[], signalToSet: WritableSignal<OrganPetitionResponse[]>) {
    signalToSet.set(draftPetitions);
    return true;
  }

  private handleSuccessSave(petition: OrganPetitionResponse) {
    this._lastPetitionSaved.set(petition);
    return true;
  }


  private handleErrorLoad(error: any, signalToSet: WritableSignal<OrganPetitionResponse[]>) {

    let errMessage = `Unexpected error happened.`;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'Imposible to obtain organ petitions.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error on GET petition to obtain organ petitions: ', errMessage);

    signalToSet.set([]);
    return of(false);

  }


  private handleErrorSave(error: any) {

    let errMessage = `Unexpected error happened.`;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'Imposible to save organ petition.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error on POST petition to save organ petition: ', errMessage);

    this._lastPetitionSaved.set({}); return of(false);

  }


}
