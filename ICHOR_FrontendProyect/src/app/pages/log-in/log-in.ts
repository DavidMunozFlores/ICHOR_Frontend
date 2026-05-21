import { ChangeDetectionStrategy, Component, signal, WritableSignal, inject } from '@angular/core';
import { PublicKeyService } from '../../services/PublicKey';
import { LogInData } from '../../interfaces/LogInData';
import { CipherDataService } from '../../services/CipherData';

@Component({
  selector: 'app-log-in',
  imports: [],
  templateUrl: './log-in.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogIn {

  name:WritableSignal<string> = signal('');
  pass:WritableSignal<string> = signal('');


  cipherDataService:CipherDataService = inject(CipherDataService);

  userTry: LogInData = {
    name: this.name(),
    pass:this.pass()
  }



}
