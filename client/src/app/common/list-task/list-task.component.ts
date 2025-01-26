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
      taskType: TaskType.SOCIAL,
      description: 'Help organize an event for the elderly. VUE ELDER/VOLUNTEER QUI ACCEPTE',
      distance: 10,
      creationDate: new Date(2025, 0, 25),
      dueDate: new Date(2025, 0, 30),
      taskStatus: TaskStatus.ACCEPTED,
      userType: UserType.ELDER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.PHYSICAL,
      description: 'Assist in medical checkup sessions. VUE VOLUNTEER QUI CHERCHE',
      distance: 5,
      creationDate: new Date(2025, 0, 22),
      dueDate: new Date(2025, 0, 29),
      taskStatus: TaskStatus.ACTIVE,
      userType: UserType.VOLUNTEER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.SOCIAL,
      description: 'Guide the elderly in community activities. VUE MODIFIER CEUX PUBLIES',
      distance: 15,
      creationDate: new Date(2025, 0, 15),
      dueDate: new Date(2025, 0, 25),
      taskStatus: TaskStatus.ACTIVE,
      userType: UserType.ELDER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.SOCIAL,
      description: 'Help organize an event for the elderly. VUE ELDER/VOLUNTEER QUI ACCEPTE',
      distance: 10,
      creationDate: new Date(2025, 0, 25),
      dueDate: new Date(2025, 0, 30),
      taskStatus: TaskStatus.ACCEPTED,
      userType: UserType.ELDER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.PHYSICAL,
      description: 'Assist in medical checkup sessions. VUE VOLUNTEER QUI CHERCHE',
      distance: 5,
      creationDate: new Date(2025, 0, 22),
      dueDate: new Date(2025, 0, 29),
      taskStatus: TaskStatus.ACTIVE,
      userType: UserType.VOLUNTEER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.SOCIAL,
      description: 'Guide the elderly in community activities. VUE MODIFIER CEUX PUBLIES',
      distance: 15,
      creationDate: new Date(2025, 0, 15),
      dueDate: new Date(2025, 0, 25),
      taskStatus: TaskStatus.ACTIVE,
      userType: UserType.ELDER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.SOCIAL,
      description: 'Help organize an event for the elderly. VUE ELDER/VOLUNTEER QUI ACCEPTE',
      distance: 10,
      creationDate: new Date(2025, 0, 25),
      dueDate: new Date(2025, 0, 30),
      taskStatus: TaskStatus.ACCEPTED,
      userType: UserType.ELDER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.PHYSICAL,
      description: 'Assist in medical checkup sessions. VUE VOLUNTEER QUI CHERCHE',
      distance: 5,
      creationDate: new Date(2025, 0, 22),
      dueDate: new Date(2025, 0, 29),
      taskStatus: TaskStatus.ACTIVE,
      userType: UserType.VOLUNTEER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.SOCIAL,
      description: 'Guide the elderly in community activities. VUE MODIFIER CEUX PUBLIES',
      distance: 15,
      creationDate: new Date(2025, 0, 15),
      dueDate: new Date(2025, 0, 25),
      taskStatus: TaskStatus.ACTIVE,
      userType: UserType.ELDER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.SOCIAL,
      description: 'Help organize an event for the elderly. VUE ELDER/VOLUNTEER QUI ACCEPTE',
      distance: 10,
      creationDate: new Date(2025, 0, 25),
      dueDate: new Date(2025, 0, 30),
      taskStatus: TaskStatus.ACCEPTED,
      userType: UserType.ELDER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.PHYSICAL,
      description: 'Assist in medical checkup sessions. VUE VOLUNTEER QUI CHERCHE',
      distance: 5,
      creationDate: new Date(2025, 0, 22),
      dueDate: new Date(2025, 0, 29),
      taskStatus: TaskStatus.ACTIVE,
      userType: UserType.VOLUNTEER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.SOCIAL,
      description: 'Guide the elderly in community activities. VUE MODIFIER CEUX PUBLIES',
      distance: 15,
      creationDate: new Date(2025, 0, 15),
      dueDate: new Date(2025, 0, 25),
      taskStatus: TaskStatus.ACTIVE,
      userType: UserType.ELDER,
      taskTitle: "TASK BIDON"
    },{
      taskType: TaskType.SOCIAL,
      description: 'Help organize an event for the elderly. VUE ELDER/VOLUNTEER QUI ACCEPTE',
      distance: 10,
      creationDate: new Date(2025, 0, 25),
      dueDate: new Date(2025, 0, 30),
      taskStatus: TaskStatus.ACCEPTED,
      userType: UserType.ELDER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.PHYSICAL,
      description: 'Assist in medical checkup sessions. VUE VOLUNTEER QUI CHERCHE',
      distance: 5,
      creationDate: new Date(2025, 0, 22),
      dueDate: new Date(2025, 0, 29),
      taskStatus: TaskStatus.ACTIVE,
      userType: UserType.VOLUNTEER,
      taskTitle: "TASK BIDON"
    },
    {
      taskType: TaskType.SOCIAL,
      description: 'Guide the elderly in community activities. VUE MODIFIER CEUX PUBLIES',
      distance: 15,
      creationDate: new Date(2025, 0, 15),
      dueDate: new Date(2025, 0, 25),
      taskStatus: TaskStatus.ACTIVE,
      userType: UserType.ELDER
    }
  ];
}
