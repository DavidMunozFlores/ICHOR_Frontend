import { inject, Injectable, signal } from '@angular/core';
import { PublicKeyService } from './PublicKey.service';
import { JSEncrypt } from 'jsencrypt';


@Injectable({
  providedIn: 'root',
})
export class EncryptDataService {

  private publicKeyService = inject(PublicKeyService);
  private cipher = new JSEncrypt();

  constructor(){
    const publicKey: string = '';

    this.publicKeyService.get().subscribe({
      next: (value) => {
        console.log('Valor de public key',value.publicKey);
        this.cipher.setPublicKey(value.publicKey);
      },
      error: (value) => {
        console.error(value);
      }
    });

  }


  public encrypt(data: string): string | false{
    return this.cipher.encrypt(data);
  }

  public decrypt(data: string): string | false{
    return this.cipher.decrypt(data);
  }

}
