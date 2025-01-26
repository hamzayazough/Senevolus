import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../constants';
import { SocketService } from '../../services/socket.service';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  taskData = {
    elder_id:'',
    title: '',
    description: '',
    type: '',
    date_created: '',
    task_date: '',
    starting_hour: '',
    timeEnd: '',
    status:'',
    hour_duration: 0,
    is_volunteer_evaluated:false,
    volunteer_id:'',
    address:''
  }

  constructor(
    private router : Router,
    private socket : SocketService)
    {}

  getHourDifference(timeStart: string, timeEnd: string): number {
    // Parse the time strings to Date objects (we use today's date for both)
    const dateStart = new Date(`1970-01-01T${timeStart}:00`);
    const dateEnd = new Date(`1970-01-01T${timeEnd}:00`);
  
    // Get the difference in milliseconds
    const diffInMilliseconds = dateEnd.getTime() - dateStart.getTime();
  
    // Convert milliseconds to hours
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    const roundedDiff = Math.round(diffInHours * 10) / 10;

    return roundedDiff;
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.taskData.type = target.value;
    console.log('Selected type:', this.taskData.type);
  }
   onSubmit() {
    this.taskData.elder_id = this.socket.UID;
    this.taskData.hour_duration = this.getHourDifference(this.taskData.timeEnd, this.taskData.starting_hour);
    this.taskData.status = 'published';
    this.socket.send('taskCreated', ({task:this.taskData}));
    this.router.navigate([AppRoute.HOMEELDER]);
  }
}
