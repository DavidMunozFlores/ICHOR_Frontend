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

    const aesKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256},
      true,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded: Uint8Array<ArrayBuffer> = new TextEncoder().encode(plaintext);
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      aesKey,
      encoded
    );

    const rawAesKey = await crypto.subtle.exportKey('raw', aesKey);
    const encryptedAesKeyBuffer = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      importedKey,
      rawAesKey
    );

    return this.packagePayload(iv, encryptedAesKeyBuffer, encryptedBuffer);
  }

  private packagePayload(iv: Uint8Array, encryptedAesKey: ArrayBuffer, encryptedByAesData: ArrayBuffer): string {
    const encryptedKeyArray = new Uint8Array(encryptedAesKey);
    const encryptedDataArray = new Uint8Array(encryptedByAesData);

    const payload = {
      iv: btoa(String.fromCodePoint(...iv)),
      encryptedKey: btoa(String.fromCharCode(...encryptedKeyArray)),
      ciphertext: btoa(String.fromCharCode(...encryptedDataArray))
    }

    return btoa(JSON.stringify(payload));
  }
}
