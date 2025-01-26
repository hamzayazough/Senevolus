import { Component, Input } from '@angular/core';
import { TaskStatus, TaskType, UserType } from '../../enum';
import { Router } from '@angular/router';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ChatService } from '../../services/chat-service/chat-service.service';
import { SocketService } from '../../services/socket.service';
import { MatDialog } from '@angular/material/dialog';
import { EndTaskDialogComponent } from '../../end-task-dialog/end-task-dialog.component';

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
  @Input() duration : number = 0;
  @Input() taskStatus !: string;
  @Input() title : string = "TITRE BIDON";
  @Input() visible : boolean = true;
  @Input() _id : string = '';
  @Input() elder_id : string = '';
  @Input() volunteer_id : string = '';

  get userType() {
    return this.socket.user.role;
  }

  constructor(
    private router : Router,
    private chatService : ChatService,
    private socket : SocketService,
    private dialog : MatDialog,
  ) {
      console.log(this.distance);
  }
  navigate(adress : string) : void {
    this.router.navigate([adress]);
  }

  toggleChat() {
    this.chatService.toggleChat();
  }

  acceptTask() {
    this.socket.send('taskAccepted', {volunteer_id : this.socket.UID, task_id:this._id, elder_id:this.elder_id} )
  }

  removeTask() {
    console.log("REMOVE")
    this.socket.send('taskRemoved', {elder_id : this.socket.UID, task_id:this._id, volunteer_id:this.volunteer_id} )
  }

  completeTask() {
    this.dialog.open(EndTaskDialogComponent, {
      data: { task_id: this._id },
    });
  }

}
