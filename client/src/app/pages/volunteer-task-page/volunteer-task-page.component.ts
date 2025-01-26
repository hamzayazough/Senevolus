import { Component } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat-service.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-volunteer-task-page',
  templateUrl: './volunteer-task-page.component.html',
  styleUrl: './volunteer-task-page.component.scss'
})
export class VolunteerTaskPageComponent {
  get opened() {
      return this.chatService.opened;
    }
  
    get tasks() {
      return this.socket.tasks;
    }
  
    constructor(
      private chatService : ChatService,
      private socket: SocketService
    ) {
      this.socket.send('getListVolunteer', this.socket.UID);
    }
  }
