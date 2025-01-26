import { Component, Input } from '@angular/core';
import { TaskStatus, TaskType, UserType } from '../../enum';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ChatService } from '../../services/chat-service/chat-service.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() taskType : string = TaskType.SOCIAL;
  @Input() description : string = "Lorem ipsum dolrolasdjhbfdvndca as dashdhashdashdhas dhashdsahd sahdas";
  @Input() distance : number = 0;
  @Input() creationDate : Date = new Date(2025, 0, 25, 0, 0, 0);
  @Input() dueDate : Date = new Date(2025, 0, 26, 0, 0, 0);
  @Input() duration : number = 2;
  @Input() taskStatus : string = TaskStatus.ACTIVE;
  @Input() taskTitle : string = "TITRE BIDON";
  userType : string = "";


  constructor(
    private router : Router,
    private authService : AuthService,
    private chatService : ChatService
  ) {
      this.userType = this.authService.userType;
  }
  navigate(adress : string) : void {
    this.router.navigate([adress]);
  }

  toggleChat() {
    this.chatService.toggleChat();
  }

}
