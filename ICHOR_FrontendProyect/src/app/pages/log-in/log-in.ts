import { ChangeDetectionStrategy, Component, signal, WritableSignal, inject, computed, Signal } from '@angular/core';
import { PublicKeyService } from '../../services/PublicKey.service';
import { LogInData } from '../../interfaces/LogInData';
import { EncryptDataService } from '../../services/EncryptData.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-log-in',
  imports: [],
  templateUrl: './log-in.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogIn {

  http = inject(HttpClient);

  name:WritableSignal<string> = signal('');
  pass:WritableSignal<string> = signal('');

  encryptDataService:EncryptDataService = inject(EncryptDataService);

  userTry: Signal<LogInData> = computed( () => {

    const user: LogInData = {
      name: this.name(),
      pass: this.pass()
    };

    return user;
  });

  logUser(){

    console.log(this.userTry().name, this.userTry().pass, this.userTry());

    const userEncrypt = this.encryptDataService.encrypt(JSON.stringify(this.userTry()));

    console.log('valor en login de userEncrypt',userEncrypt);
    // this.http.post('http://localhost:8080/api/v1/login', userEncrypt).subscribe(
       // TODO! logica para lo que recibo del post nose
    // );

    this.clear();
  }

  clear(){
    this.name.set('');
    this.pass.set('');
  }


}
