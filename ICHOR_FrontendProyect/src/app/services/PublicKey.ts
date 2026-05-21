import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicKeyService {

  private API_URL: string = 'http://localhost:8080/';
  private http = inject(HttpClient);

  public get(): string {
    const key = signal('');
    this.http.get<string>(`${this.API_URL}/api/v1/keys/public`).subscribe( (value) => {
      key.set(value);
    });
    return key();
  }

}
