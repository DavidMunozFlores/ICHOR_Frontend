import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicKeyResponse } from '../interfaces/PublicKeyResponse';
import { API_URL } from './API_URL.const';

@Injectable({
  providedIn: 'root',
})
export class PublicKeyService {

  private http = inject(HttpClient);

  public get(): Observable<PublicKeyResponse> {
    return this.http.get<PublicKeyResponse>(`${API_URL}/api/v1/keys/public-key`);
  }

}
