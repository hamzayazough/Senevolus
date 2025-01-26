import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../constants';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  taskData = {
    title: '',
    description: '',
    location: '',
    category: '',
    createdDate: '',
    dueDate: '',
    timeStart: '',
    timeEnd: ''
  }
  constructor(
    private router : Router)
    {}
  
   onSubmit() {
      console.log('Task Data:', this.taskData);
      this.router.navigate([AppRoute.MANAGETASK])
    }
}
