import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PublicKeyService } from './PublicKey';
import * as CryptJS from 'crypto-js';


@Injectable({
  providedIn: 'root',
})
export class CipherDataService {

// lógica para cifrar con la clave publica del back que he pedido
private publicKey = inject(PublicKeyService);



}
