import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PublicKeyService {

  private API_URL: string = 'http://localhost:8080/';
  private http = inject(HttpClient);

  public get() {
    return this.http.get(`${this.API_URL}/public/key`);
  }

}
