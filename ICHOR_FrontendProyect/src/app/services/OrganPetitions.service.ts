import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { OrganPetitionResponse } from '../interfaces/Doctor/OrganPetitionResponse.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LogInCredentials } from '../interfaces/LogIn/LogInCredentials';
import { IOrganPetition } from '../interfaces/Doctor/IOrganPetition.interface';
import { OrganPetitionPost } from '../interfaces/Doctor/OrganPetitionPost.interface';
import { API_URL } from './API_URL.const';
import { OrganPetitionID } from '../interfaces/Doctor/OrganPetitionID.interface';
import { OrganPetitionAcceptPatch } from '../interfaces/Doctor/OrganPetitionAcceptPatch.interface';


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




  private _availableToAssignPetitions: WritableSignal<OrganPetitionResponse[]> = signal(this.waitingPetitions().filter( p => p.organAssigned !== null))
  availableToAssignPetitions = this._availableToAssignPetitions.asReadonly();

  private _disavailableToAssignPetitions: WritableSignal<OrganPetitionResponse[]> = signal(this.waitingPetitions().filter( p => p.organAssigned === null))
  disavailableToAssignPetitions = this._disavailableToAssignPetitions.asReadonly();



  private _lastPetitionSaved: WritableSignal<OrganPetitionResponse | {} > = signal({});
  lastPetitionSaved = this._lastPetitionSaved.asReadonly();

  private _lastPetitionAccepted: WritableSignal<OrganPetitionResponse | {} > = signal({});
  lastPetitionAccepted = this._lastPetitionAccepted.asReadonly();

  private _lastPetitionAssigned: WritableSignal<OrganPetitionResponse | {} > = signal({});
  lastPetitionAssigned = this._lastPetitionAccepted.asReadonly();

  private _lastPetitionCancelled: WritableSignal<OrganPetitionResponse | {} > = signal({});
  lastPetitionCancelled = this._lastPetitionAccepted.asReadonly();




  savePetition(data: IOrganPetition): Observable<boolean> {

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

  //TODO! DELETEpETITION

  acceptPetition(idPetition: number): Observable<boolean> {

    const credentials: LogInCredentials = {
      username: sessionStorage.getItem('username')!,
      password: sessionStorage.getItem('password')!,
    }

    const acceptPetition: OrganPetitionID = {
      idOrganPetition: idPetition
    }

    const body: OrganPetitionAcceptPatch = {
      authCredentials: credentials,
      data: acceptPetition
    }


    return this.http.patch<OrganPetitionResponse>(`${API_URL}/api/v1/organ-petitions/accept`, body).pipe(
      map(response => this.handleSuccessAccept(response)),
      catchError(error => this.handleErrorAccept(error))
    )

  }

  assingPetition(idPetition: number): Observable<boolean> {

    const credentials: LogInCredentials = {
      username: sessionStorage.getItem('username')!,
      password: sessionStorage.getItem('password')!,
    }

    const checkedPetition: OrganPetitionID = {
      idOrganPetition: idPetition
    }

    const body: OrganPetitionAcceptPatch = {
      authCredentials: credentials,
      data: checkedPetition
    }


    return this.http.patch<OrganPetitionResponse>(`${API_URL}/api/v1/organ-petitions/checked`, body).pipe(
      map(response => this.handleSuccessAssign(response)),
      catchError(error => this.handleErrorAssign(error))
    )

  }

  cancelPetition(idPetition: number): Observable<boolean> {

    const credentials: LogInCredentials = {
      username: sessionStorage.getItem('username')!,
      password: sessionStorage.getItem('password')!,
    }

    const cancelPetition: OrganPetitionID = {
      idOrganPetition: idPetition
    }

    const body: OrganPetitionAcceptPatch = {
      authCredentials: credentials,
      data: cancelPetition
    }


    return this.http.patch<OrganPetitionResponse>(`${API_URL}/api/v1/organ-petitions/cancell`, body).pipe(
      map(response => this.handleSuccessCancel(response)),
      catchError(error => this.handleErrorCancel(error))
    )

  }



  loadDraftPetitions(): Observable<boolean> {
    return this.http.get<OrganPetitionResponse[]>(`${API_URL}/api/v1/organ-petitions/state/DRAFT`).pipe(
      map(draftPetitions => this.handleSuccessLoad(draftPetitions, this._draftPetitions)),
      catchError(error => this.handleErrorLoad(error, this._draftPetitions))
    )
  }

  loadAssignedPetitions(): Observable<boolean> {
    return this.http.get<OrganPetitionResponse[]>(`${API_URL}/api/v1/organ-petitions/state/ASSIGNED_ORGAN`).pipe(
      map(assignedPetitions => this.handleSuccessLoad(assignedPetitions, this._assignedPetitions)),
      catchError(error => this.handleErrorLoad(error, this._assignedPetitions))
    )
  }

  loadCancelledPetitions(): Observable<boolean> {
    return this.http.get<OrganPetitionResponse[]>(`${API_URL}/api/v1/organ-petitions/state/CANCELLED`).pipe(
      map(cancelledPetitions => this.handleSuccessLoad(cancelledPetitions, this._cancelledPetitions)),
      catchError(error => this.handleErrorLoad(error, this._cancelledPetitions))
    )
  }

  loadWaitingPetitions(): Observable<boolean> {
    return this.http.get<OrganPetitionResponse[]>(`${API_URL}/api/v1/organ-petitions/state/WAITING`).pipe(
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

  private handleSuccessAccept(petition: OrganPetitionResponse) {
    this._lastPetitionAccepted.set(petition);
    return true;
  }

  private handleSuccessAssign(petition: OrganPetitionResponse) {
    this._lastPetitionAssigned.set(petition);
    return true;
  }

  private handleSuccessCancel(petition: OrganPetitionResponse) {
    this._lastPetitionCancelled.set(petition);
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

  private handleErrorAccept(error: any) {

    let errMessage = `Unexpected error happened.`;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'Imposible to accept organ petition.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error on PATCH petition to accept organ petition: ', errMessage);

    this._lastPetitionAccepted.set({});
    return of(false);

  }


  private handleErrorAssign(error: any) {

    let errMessage = `Unexpected error happened.`;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'Imposible to assing/check organ petition.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error on PATCH petition to assing/check organ petition: ', errMessage);

    this._lastPetitionAssigned.set({});
    return of(false);

  }

  private handleErrorCancel(error: any) {

    let errMessage = `Unexpected error happened.`;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'Imposible to cancel organ petition.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error on PATCH petition to cancel organ petition: ', errMessage);

    this._lastPetitionCancelled.set({});
    return of(false);

  }


}
