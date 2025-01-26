import { Injectable } from '@angular/core';
import { SocketService } from '../socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  opened : boolean = false;
  chatMessages : any = [{
    name : 'elder',
    message : 'LOLaaaaaaaaaaaaOL',
    type : 'received'
  },
  {
    name : 'volunteer',
    message : 'LOLaaaaaaaaaaaOLOL',
    type : 'sent'
  }];


  constructor(
    public socketService: SocketService
  ) { 
    
  }

  sendMessage(name : string, message : string) {
    this.socketService.send('sendMessage', {name: name, message: message, type : 'received'})
  }

  initializeEvents() {
    this.socketService.on('gotMessages', (messages:[{name : string, message : string}]) => {
      this.chatMessages = messages;
    });
  }

  getMessages() {
    this.socketService.send('getMessages')
  }

  toggleChat() {
    this.opened = !this.opened;
  }
}
