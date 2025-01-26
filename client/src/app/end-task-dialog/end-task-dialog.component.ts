import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FileUploadService } from '../services/file-upload.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-end-task-dialog',
  templateUrl: './end-task-dialog.component.html',
  styleUrls: ['./end-task-dialog.component.scss'],
})
export class EndTaskDialogComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  isCameraOn: boolean = false;
  capturedImage: string | null = null;
  mediaStream: MediaStream | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private socket: SocketService,
    private fileUploadService: FileUploadService
  ) {}

  async startCamera() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.videoElement.nativeElement.play();
      this.isCameraOn = true;
    } catch (error) {
      console.error('Error opening camera:', error);
      alert('Error opening camera. Please ensure you have granted permission.');
    }
  }

  takePicture() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas image to data URL
    this.capturedImage = canvas.toDataURL('image/png');

    // Stop the camera stream
    this.stopCamera();
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.isCameraOn = false;
    }
  }

  submit^Picture() {
    if (this.capturedImage) {
      // Convert dataURL to File objects
      const selfiePhotoFile = this.dataURLtoFile(this.capturedImage, 'idPhoto.png');
  
      // Upload the files using the FileUploadService
      this.fileUploadService.uploadSelfiePhoto(selfiePhotoFile).subscribe(
        (response) => {
          console.log('Upload successful:', response);
          // Proceed with form submission
          this.submitFormData();
        },
        (error) => {
          console.error('Upload failed:', error);
        }
      );
    } else {
      console.error('Both ID photo and person photo are required.');
    }
  }
  }

