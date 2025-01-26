import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-success',
  templateUrl: './upload-success.component.html',
  styleUrl: './upload-success.component.scss'
})
export class UploadSuccessComponent {
  constructor(
    public dialogRef: MatDialogRef<UploadSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, idCard: string, personPhoto: string }
  ) {}
}
