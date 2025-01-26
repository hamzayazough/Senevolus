import { Component } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  constructor(
    public chatService : ChatService
  ) {}
  
}
