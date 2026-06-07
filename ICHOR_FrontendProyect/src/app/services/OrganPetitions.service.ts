import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { OrganPetitionResponse } from '../interfaces/Doctor/OrganPetitionResponse.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LogInCredentials } from '../interfaces/LogIn/LogInCredentials';
import { IOrganPetition } from '../interfaces/Doctor/IOrganPetition.interface';
import { OrganPetitionPost } from '../interfaces/Doctor/OrganPetitionPost.interface';
import { API_URL } from './API_URL.const';
import { OrganPetitionID } from '../interfaces/Doctor/OrganPetitionID.interface';
import { OrganPetitionUpdateStatusPatch } from '../interfaces/Doctor/OrganPetitionUpdateStatusPatch.interface';
import { OrganPetitionUpdate } from '../interfaces/Doctor/OrganPetitionUpdate.interface';
import { OrganPetitionUpdatePost } from '../interfaces/Doctor/OrganPetitionUpdatePost.interface';
import { InfoMessageService } from './InfoMessage.service';
import { PatientResponse } from '../interfaces/Doctor/PatientResponse';


@Injectable({ providedIn: 'root' })
export class OrganPetitionService {

  private http = inject(HttpClient);
  private infoMessageService = inject(InfoMessageService);


  private _lastPatientByIdentification:
    WritableSignal<PatientResponse | undefined> = signal<PatientResponse | undefined>(undefined);
  lastPatientByIdentification = this._lastPatientByIdentification.asReadonly();

  private _lastPatientById:
    WritableSignal<PatientResponse | undefined> = signal<PatientResponse | undefined>(undefined);
  lastPatientById = this._lastPatientById.asReadonly();




  private _draftPetitions: WritableSignal<OrganPetitionResponse[]> = signal<OrganPetitionResponse[]>([]);
  draftPetitions = this._draftPetitions.asReadonly();

  private _cancelledPetitions: WritableSignal<OrganPetitionResponse[]> = signal<OrganPetitionResponse[]>([]);
  cancelledPetitions = this._cancelledPetitions.asReadonly();

  private _waitingPetitions: WritableSignal<OrganPetitionResponse[]> = signal<OrganPetitionResponse[]>([]);
  waitingPetitions = this._waitingPetitions.asReadonly();

  private _assignedPetitions: WritableSignal<OrganPetitionResponse[]> = signal<OrganPetitionResponse[]>([]);
  assignedPetitions = this._assignedPetitions.asReadonly();




  availableToAssignPetitions: Signal<OrganPetitionResponse[]> = computed(() =>
    this._waitingPetitions().filter(p => p.organAssigned !== null)
  );



  unavailableToAssignPetitions: Signal<OrganPetitionResponse[]> = computed(() =>
    this._waitingPetitions().filter(p => p.organAssigned === null)
  );


  private _lastPetitionSaved: WritableSignal<OrganPetitionResponse | {}> = signal({});
  lastPetitionSaved = this._lastPetitionSaved.asReadonly();

  private _lastPetitionAccepted: WritableSignal<OrganPetitionResponse | {}> = signal({});
  lastPetitionAccepted = this._lastPetitionAccepted.asReadonly();

  private _lastPetitionAssigned: WritableSignal<OrganPetitionResponse | {}> = signal({});
  lastPetitionAssigned = this._lastPetitionAccepted.asReadonly();

  private _lastPetitionCancelled: WritableSignal<OrganPetitionResponse | {}> = signal({});
  lastPetitionCancelled = this._lastPetitionAccepted.asReadonly();

  private _lastPetitionDeleted: WritableSignal<OrganPetitionResponse | {}> = signal({});
  lastPetitionDeleted = this._lastPetitionDeleted.asReadonly();



  getPatientByIdentification(identification: string): Observable<boolean> {

    return this.http.get<PatientResponse>(`${API_URL}/api/v1/patients/identification/${identification}`).pipe(
      map(response => this.handleSuccessGetPatientByIdentification(response)),
      catchError(error => this.handleErrorGetPatientByIdentification(error))
    );

  }

  getPatientById(id: number): Observable<boolean> {

    return this.http.get<PatientResponse>(`${API_URL}/api/v1/patients/${id}`).pipe(
      map(response => this.handleSuccessGetPatientById(response)),
      catchError(error => this.handleErrorGetPatientById(error))
    );

  }




  savePetition(data: IOrganPetition): Observable<boolean> {

    const credentials: LogInCredentials = {
      username: sessionStorage.getItem('username')!,
      password: sessionStorage.getItem('password')!,
    }

    const body: OrganPetitionPost = {
      authCredentials: credentials,
      data: data
    }

    console.log(body);

    return this.http.post<OrganPetitionResponse>(`${API_URL}/api/v1/organ-petitions/create`, body).pipe(
      map(response => this.handleSuccessSave(response)),
      catchError(error => this.handleErrorSave(error))
    )

  }


  updatePetition(data: OrganPetitionUpdate) {

    const credentials: LogInCredentials = {
      username: sessionStorage.getItem('username')!,
      password: sessionStorage.getItem('password')!,
    }

    const body: OrganPetitionUpdatePost = {
      authCredentials: credentials,
      data: data
    }


    return this.http.post<OrganPetitionResponse>(`${API_URL}/api/v1/organ-petitions/update`, body).pipe(
      map(response => this.handleSuccessSave(response)),
      catchError(error => this.handleErrorSave(error))
    )

  }

  deletePetition(idPetition: number) {

    const credentials: LogInCredentials = {
      username: sessionStorage.getItem('username')!,
      password: sessionStorage.getItem('password')!
    }

    const cancelPetition: OrganPetitionID = {
      idOrganPetition: idPetition
    }

    const body: OrganPetitionUpdateStatusPatch = {
      authCredentials: credentials,
      data: cancelPetition
    }


    return this.http.post<OrganPetitionResponse>(`${API_URL}/api/v1/organ-petitions/delete`, body).pipe(
      map(response => this.handleSuccessDelete(response)),
      catchError(error => this.handleErrorDelete(error))
    )

  }

  acceptPetition(idPetition: number): Observable<boolean> {

    const credentials: LogInCredentials = {
      username: sessionStorage.getItem('username')!,
      password: sessionStorage.getItem('password')!,
    }

    const acceptPetition: OrganPetitionID = {
      idOrganPetition: idPetition
    }

    const body: OrganPetitionUpdateStatusPatch = {
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

    const body: OrganPetitionUpdateStatusPatch = {
      authCredentials: credentials,
      data: checkedPetition
    }


    return this.http.patch<OrganPetitionResponse>(`${API_URL}/api/v1/organ-petitions/check`, body).pipe(
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

    const body: OrganPetitionUpdateStatusPatch = {
      authCredentials: credentials,
      data: cancelPetition
    }


    return this.http.patch<OrganPetitionResponse>(`${API_URL}/api/v1/organ-petitions/cancel`, body).pipe(
      map(response => this.handleSuccessCancel(response)),
      catchError(error => this.handleErrorCancel(error))
    )

  }



  loadDraftPetitions(): Observable<boolean> {
    return this.http.get<OrganPetitionResponse[]>(`${API_URL}/api/v1/organ-petitions/state/DRAFT`).pipe(
      map(draftPetitions => this.handleSuccessLoad(draftPetitions, this._draftPetitions)),
      catchError(error => this.handleErrorLoad(error, this._draftPetitions)),
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

  private handleSuccessGetPatientByIdentification(patient: PatientResponse) {
    this._lastPatientByIdentification.set(patient);
    return true;
  }

  private handleSuccessGetPatientById(patient: PatientResponse) {
    this._lastPatientById.set(patient);
    return true;
  }

  private handleSuccessLoad(petitions: OrganPetitionResponse[], signalToSet: WritableSignal<OrganPetitionResponse[]>) {
    signalToSet.set(petitions);
    this.infoMessageService.loadInfo('Petitions loaded correctly.');
    return true;
  }

  private handleSuccessSave(petition: OrganPetitionResponse) {
    this._lastPetitionSaved.set(petition);
    this.infoMessageService.loadSuccess('Petition saved successfully.')
    return true;
  }

  private handleSuccessAccept(petition: OrganPetitionResponse) {
    this._lastPetitionAccepted.set(petition);
    this.infoMessageService.loadSuccess('Petition accepted successfully.')
    return true;
  }

  private handleSuccessAssign(petition: OrganPetitionResponse) {
    this._lastPetitionAssigned.set(petition);
    this.infoMessageService.loadSuccess('Petition assigned successfully.')
    return true;
  }

  private handleSuccessCancel(petition: OrganPetitionResponse) {
    this._lastPetitionCancelled.set(petition);
    this.infoMessageService.loadSuccess('Petition cancelled successfully.')
    return true;
  }

  private handleSuccessDelete(petition: OrganPetitionResponse) {
    this._lastPetitionDeleted.set(petition);
    this.infoMessageService.loadSuccess('Petition deleted successfully.')
    return true;
  }


  private handleErrorGetPatientByIdentification(error:any){

    let errMessage = `Unexpected error happened.`;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'Imposible to obtain patient by identification.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error on GET petition to obtain patient by identification: ', errMessage);


    this._lastPatientByIdentification.set(undefined);
    return of(false);

  }

  private handleErrorGetPatientById(error:any){

    let errMessage = `Unexpected error happened.`;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'Imposible to obtain patient by id.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error on GET petition to obtain patient by id: ', errMessage);


    this._lastPatientById.set(undefined);
    return of(false);

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

    this.infoMessageService.loadError('Ups! Something went wrong loading petitions.')

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

    this.infoMessageService.loadError('Ups! Something went wrong saving the petition.')

    this._lastPetitionSaved.set({});
    return of(false);

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

    this.infoMessageService.loadError('Ups! Something went wrong accepting the petition.')

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

    this.infoMessageService.loadError('Ups! Something went wrong assigning the petition.')

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

    this.infoMessageService.loadError('Ups! Something went wrong cancelling the petition.')

    this._lastPetitionCancelled.set({});
    return of(false);

  }

  private handleErrorDelete(error: any) {

    let errMessage = `Unexpected error happened.`;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        errMessage = 'Server Error';
      } else if (error.status === 500) {
        errMessage = 'Imposible to delete organ petition.';
      }
    } else {
      console.error('Encryption or Client Error:', error);
      errMessage = error.message || 'Client side error';
    }

    console.error('Catched error on PATCH petition to delete organ petition: ', errMessage);

    this.infoMessageService.loadError('Ups! Something went wrong deleting the petition.')

    this._lastPetitionDeleted.set({});
    return of(false);

  }


}
