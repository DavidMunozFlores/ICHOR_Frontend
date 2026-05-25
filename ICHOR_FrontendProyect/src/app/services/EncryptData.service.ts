import { inject, Injectable, signal } from '@angular/core';
import { PublicKeyService } from './PublicKey.service';
import { buffer, firstValueFrom } from 'rxjs';
import { PublicKeyResponse } from '../interfaces/PublicKeyResponse';


@Injectable({
  providedIn: 'root',
})
export class EncryptDataService {

  private publicKeyService = inject(PublicKeyService);
  private publicKey = '';


  async encrypt(plaintext: string): Promise<string> {



    if (!this.publicKey) {
      try {
        const response: PublicKeyResponse = await firstValueFrom(this.publicKeyService.get());
        this.publicKey = response.publicKey;
      } catch (err) {
        throw new Error(`There was an error getting the key: ${err}`);
      }
    }


    const keyBuffer = Uint8Array.from(atob(this.publicKey), c => c.charCodeAt(0));

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
