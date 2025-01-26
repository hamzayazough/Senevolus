import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../constants';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.scss'
})
export class CreateProfileComponent {
  @ViewChild('videoElement') videoElement! : ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement! : ElementRef<HTMLCanvasElement>;

  step: number = 1;
  isCameraOn: boolean = false;
  capturedImage: string | null = null;
  mediaStream: MediaStream | null = null;
  idPhoto: string | null = null;
  personPhoto: string | null = null;

  async startCamera() {
    try{
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
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
    
    const capturedImage = canvas.toDataURL('image/png');


    if (this.step === 1){
      this.idPhoto = capturedImage;
    } else if (this.step === 2){
      this.personPhoto = capturedImage;
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.isCameraOn = false;
      this.videoElement.nativeElement.srcObject = null;
    }
  }

  nextStep() {
    if (this.step === 1 && this.idPhoto) {
      this.step = 2;
    }
  }

  previousStep(){
    if (this.step === 2){
      this.step = 1;
    }
  }

  formData = {
    role: '',
    age: null,
    id_card: '',
    photo_id: null,
    biography: '',
    address: ''
  };
  constructor(
    private router : Router
  ) {}

  onSubmit() {
    if (this.idPhoto && this.personPhoto) {

      console.log('Captured Image:', this.capturedImage);
    }
    console.log('Form Data:', this.formData);
    this.router.navigate([AppRoute.HOME])
  }

  onFileChange(event: Event) {
    console.log("file changed")
  }


}
