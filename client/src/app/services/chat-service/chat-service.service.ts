import { Injectable } from '@angular/core';
import { SocketService } from '../socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  opened : boolean = false;
  chatMessages : any = [{
    name : 'mina',
    message : 'LOLOLOL',
    type : 'received'
  },
  {
    name : 'alfredo',
    message : 'LOLOLOL',
    type : 'sent'
  }];


  constructor(
    private socketService: SocketService
  ) { 
    this.initializeEvents();
    this.socketService.send('getMessages');
  }

  sendMessage(name : string, message : string) {
    this.chatMessages.push({name: name, message : message, type : 'sent'});
    this.socketService.send('sendMessage', {name: name, message: message, type : 'received'})
  }

  initializeEvents() {
    this.socketService.on('receiveMessage', (message:any) => {
      this.chatMessages.push({name:message.name, message:message.message, type:'received'});
    });

    this.socketService.on('gotMessages', (messages:[{name : string, message : string}]) => {
      this.chatMessages = messages;
    });
  }

  toggleChat() {
    this.opened = !this.opened;
  }
}
