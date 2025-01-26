import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ChatService } from '../../services/chat-service/chat-service.service';

@Component({
  selector: 'app-elder-task-page',
  templateUrl: './elder-task-page.component.html',
  styleUrl: './elder-task-page.component.scss'
})
export class ElderTaskPageComponent {  
  get opened() {
    return this.chatService.opened;
  }
  constructor(
    private chatService : ChatService
  ) {}
}
