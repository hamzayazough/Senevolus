import { Component } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat-service.service';

@Component({
  selector: 'app-volunteer-task-page',
  templateUrl: './volunteer-task-page.component.html',
  styleUrl: './volunteer-task-page.component.scss'
})
export class VolunteerTaskPageComponent {
  get opened() {
    return this.chatService.opened;
  }
  constructor(
    private chatService : ChatService
  ) {}
}
