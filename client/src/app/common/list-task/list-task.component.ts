import { Component, Input, ViewChild } from '@angular/core';
import { TaskStatus, TaskType, UserType } from '../../enum';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.scss'
})
export class ListTaskComponent {
  @Input() tasks = [
    {
      type: TaskType.SOCIAL,
      description: 'Guide the elderly in community activities. VUE MODIFIER CEUX PUBLIES',
      address: {name:'string'},
      date_created: new Date(2025, 0, 15),
      task_date: new Date(2025, 0, 25),
      status: TaskStatus.ACTIVE,
      userType: UserType.ELDER,
      title: 'Titre Bidon'
    }
  ];
  @Input() section : string = '';
}
