import { ChangeDetectionStrategy, Component, signal, WritableSignal, inject, computed, Signal } from '@angular/core';
import { PublicKeyService } from '../../services/PublicKey.service';
import { LogInData } from '../../interfaces/LogInData';
import { CipherDataService } from '../../services/EncryptData.service';

@Component({
  selector: 'app-log-in',
  imports: [],
  templateUrl: './log-in.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogIn {

  name:WritableSignal<string> = signal('');
  pass:WritableSignal<string> = signal('');

  private publicKeyService: PublicKeyService = inject(PublicKeyService);
  private encodeData: CipherDataService = inject(CipherDataService);

  cipherDataService:CipherDataService = inject(CipherDataService);

  userTry: Signal<LogInData> = computed( () => {
    const user: LogInData = {
      name: this.name(),
      pass: this.pass()
    };
    return user;
  });

  logUser(){

    console.log(this.userTry().name, this.userTry().pass, this.userTry());


    //this.encodeData.encrypt(JSON.stringify(this.userTry()));
    // TODO! hacer post

    this.clear();

  }

  clear(){
    this.name.set('');
    this.pass.set('');
  }


}
