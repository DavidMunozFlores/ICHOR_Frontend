import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { InfoMessageService } from '../../../services/InfoMessage.service';

@Component({
  selector: 'app-info-message',
  imports: [],
  templateUrl: './infoMessage.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoMessage {

  infoMessageService = inject(InfoMessageService);

  messages = this.infoMessageService.infoMessages;

}
