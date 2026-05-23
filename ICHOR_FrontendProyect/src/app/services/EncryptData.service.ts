import { inject, Injectable, signal } from '@angular/core';
import { PublicKeyService } from './PublicKey.service';
import { buffer, retry } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class EncryptDataService {

  private publicKeyService = inject(PublicKeyService);


  async encrypt(plaintext: string): Promise<string> {

    let publicKey: string = '';

    this.publicKeyService.get().subscribe({
      next: (value) => {
        publicKey = value.publicKey;
      },
      error: (err) => {
        //TODO! TEST THIS PART TO SEE WHAT HAPPENS
        throw new Error(`There was an error getting the key ${err}`);
      }
    });

    const keyBuffer = Uint8Array.from(atob(publicKey), c => c.charCodeAt(0));

    const importedKey = await crypto.subtle.importKey(
      'spki',
      keyBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const encoded = new TextEncoder().encode(plaintext);
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      importedKey,
      encoded
    );

    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  }


}
