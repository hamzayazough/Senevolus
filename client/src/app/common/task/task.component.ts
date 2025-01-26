import { Component, Input } from '@angular/core';
import { TaskStatus, TaskType, UserType } from '../../enum';
import { Router } from '@angular/router';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ChatService } from '../../services/chat-service/chat-service.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() taskType : string = TaskType.SOCIAL;
  @Input() description : string = "Lorem ipsum dolrolasdjhbfdvndca as dashdhashdashdhas dhashdsahd sahdas";
  @Input() distance : string = '';
  @Input() creationDate : Date = new Date(2025, 0, 25, 0, 0, 0);
  @Input() task_date : Date = new Date(2025, 0, 26, 0, 0, 0);
  @Input() duration : string = '';
  @Input() taskStatus : string = TaskStatus.ACTIVE;
  @Input() title : string = "TITRE BIDON";
  get userType() {
    return this.socket.user.role;
  }


  constructor(
    private router : Router,
    private chatService : ChatService,
    private socket : SocketService
  ) {
      
  }
  navigate(adress : string) : void {
    this.router.navigate([adress]);
  }

  toggleChat() {
    this.chatService.toggleChat();
  }

}
