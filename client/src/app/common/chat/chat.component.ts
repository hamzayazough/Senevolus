import { Component } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  messageInput: string = '';
  constructor(
    public chatService : ChatService
  ) {
    this.chatService.initializeEvents();
    this.chatService.getMessages();
  }


  sendMessage() {
    if (this.messageInput.trim() !== '') {
      this.chatService.sendMessage(this.chatService.socketService.user.role, this.messageInput); 
      this.messageInput = '';  // Clear the input after sending
    }
  }


  
}
