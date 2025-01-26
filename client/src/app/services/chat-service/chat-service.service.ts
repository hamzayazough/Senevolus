import { Injectable } from '@angular/core';
import { SocketService } from '../socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  opened : boolean = false;
  chatMessages : [{name : string, message : string}] = [{
    name : 'mina',
    message : 'LOLOLOL'
  }]


  constructor(
    private socketService: SocketService
  ) { 
    
  }

  initializeEvents() {

  }

  toggleChat() {
    this.opened = !this.opened;
  }
}
