import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-end-task-dialog',
  templateUrl: './end-task-dialog.component.html',
  styleUrl: './end-task-dialog.component.scss'
})
export class EndTaskDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}


  
}
