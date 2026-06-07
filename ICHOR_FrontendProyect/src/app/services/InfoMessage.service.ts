import { Injectable, signal } from '@angular/core';
import { Message } from '../interfaces/Message.interface';

@Injectable({ providedIn: 'root' })
export class InfoMessageService {


  private _infoMessages = signal<Message[]>([]);
  infoMessages = this._infoMessages.asReadonly();

  private nextID = 0;

  private addMessage(msg: string, type: Message['type']){

    const newMessage: Message = {
      id: this.nextID++,
      message: msg,
      type: type
    }

    this._infoMessages.update((messages) => [...messages, newMessage])

    setTimeout(() => {

      this._infoMessages.update((messages) =>
        messages.filter(msg => msg.id !== newMessage.id)
      );

    }, 3000);
  }

  loadInfo(message: string) {
    this.addMessage(message, 'info');
  }

  loadError(message: string) {
    this.addMessage(message, 'error');
  }

  loadWarning(message: string) {
    this.addMessage(message, 'warning');
  }

  loadSuccess(message: string) {
    this.addMessage(message, 'success');
  }


}
