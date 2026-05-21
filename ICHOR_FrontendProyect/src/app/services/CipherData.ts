import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { PublicKeyService } from './PublicKey';
import * as CryptJS from 'crypto-js';


@Injectable({
  providedIn: 'root',
})
export class CipherDataService {

  // lógica para cifrar con la clave publica del back que he pedido
  private publicKeyService = inject(PublicKeyService);



  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.publicKeyService.get()).toString();
  }



}
