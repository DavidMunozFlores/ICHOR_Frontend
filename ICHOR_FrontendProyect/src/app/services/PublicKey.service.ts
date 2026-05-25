import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicKeyResponse } from '../interfaces/PublicKeyResponse';

@Injectable({
  providedIn: 'root',
})
export class PublicKeyService {

  private API_URL = 'http://localhost:8080';
  // private API_URL = 'https://41545ad6-a59e-4b93-9fe7-3fa0e135f3c5.mock.pstmn.io';

  private http = inject(HttpClient);

  public get(): Observable<PublicKeyResponse> {
    return this.http.get<PublicKeyResponse>(`${this.API_URL}/api/v1/keys/public-key`);
  }

}
