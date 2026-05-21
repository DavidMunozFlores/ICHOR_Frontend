import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { PublicKeyService } from './PublicKey.service';


@Injectable({
  providedIn: 'root',
})
export class CipherDataService {

  // lógica para cifrar con la clave publica del back que he pedido
  private publicKeyService = inject(PublicKeyService);


// TODO FIX THE ENCRYPT
  encrypt(data: string): string {
    return CryptoJS..encrypt(data, this.publicKeyService.get()).toString();
  }



}
