import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-info-message',
  imports: [],
  templateUrl: './infoMessage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoMessage {

  message = signal<string>('');

  onMessageChange(msg: string){
    this.message.set(msg);
  }

}
