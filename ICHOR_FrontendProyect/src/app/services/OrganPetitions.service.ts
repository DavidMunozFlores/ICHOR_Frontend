import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { petitionGetResponse } from '../interfaces/Doctor/petitionGetResponse.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DraftPetitions } from '../pages/DoctorPage/OrganPetitionManagement/pages/draftPetitions/draftPetitions';

@Injectable({providedIn: 'root'})
export class OrganPetitionService {

  private http = inject(HttpClient);
  private API_URL = 'https://41545ad6-a59e-4b93-9fe7-3fa0e135f3c5.mock.pstmn.io';



  private _draftPetitions: WritableSignal<petitionGetResponse[]> = signal<petitionGetResponse[]>([]);
  draftPetitions = this._draftPetitions.asReadonly();

  private _cancelledPetitions: WritableSignal<petitionGetResponse[]> = signal<petitionGetResponse[]>([]);
  cancelledPetitions = this._cancelledPetitions.asReadonly();

  private _waitingPetitions: WritableSignal<petitionGetResponse[]> = signal<petitionGetResponse[]>([]);
  waitingPetitions = this._waitingPetitions.asReadonly();

  private _assignedPetitions: WritableSignal<petitionGetResponse[]> = signal<petitionGetResponse[]>([]);
  assignedPetitions = this._assignedPetitions.asReadonly();


  loadDraftPetitions(): Observable<boolean> {
    return this.http.get<petitionGetResponse[]>(`${this.API_URL}/api/v1/organ/petition/draft`).pipe(
      map(draftPetitions =>  this.handleSuccess(draftPetitions, this._draftPetitions) ),
      catchError( error =>  this.handleError(error, this._draftPetitions)  )
    )
  }

  loadAssignedPetitions(): Observable<boolean> {
    return this.http.get<petitionGetResponse[]>(`${this.API_URL}/api/v1/organ/petition/asigned`).pipe(
      map(assignedPetitions =>  this.handleSuccess(assignedPetitions, this._assignedPetitions) ),
      catchError( error =>  this.handleError(error, this._assignedPetitions)  )
    )
  }

  loadCancelledPetitions(): Observable<boolean> {
    return this.http.get<petitionGetResponse[]>(`${this.API_URL}/api/v1/organ/petition/cancelled`).pipe(
      map(cancelledPetitions =>  this.handleSuccess(cancelledPetitions, this._cancelledPetitions) ),
      catchError( error =>  this.handleError(error, this._cancelledPetitions)  )
    )
  }

  loadWaitingPetitions(): Observable<boolean> {
    return this.http.get<petitionGetResponse[]>(`${this.API_URL}/api/v1/organ/petition/waiting`).pipe(
      map(waitingPetitions =>  this.handleSuccess(waitingPetitions, this._waitingPetitions) ),
      catchError( error =>  this.handleError(error, this._waitingPetitions)  )
    )
  }


  private handleSuccess(draftPetitions: petitionGetResponse[], signalToSet: WritableSignal<petitionGetResponse[]>){
    signalToSet.set(draftPetitions);
    return true;
  }

  private handleError(error: any, signalToSet: WritableSignal<petitionGetResponse[]>){

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


}
