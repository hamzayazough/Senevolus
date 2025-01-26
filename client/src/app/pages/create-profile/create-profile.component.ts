import { Component, ViewChild, ElementRef, AfterViewInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../constants';
import { SocketService } from '../../services/socket.service';
import { AppUser } from '../../interfaces/app-user';
import { AddressAutocompleteComponent } from '../../common/address-autocomplete/address-autocomplete.component';
import { Address } from '../../interfaces/address';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.scss',
})
export class CreateProfileComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild(AddressAutocompleteComponent)
  addressAutocomplete!: AddressAutocompleteComponent;

  step: number = 1;
  isCameraOn: boolean = false;
  capturedImage: string | null = null;
  mediaStream: MediaStream | null = null;
  idPhoto: string | null = null;
  personPhoto: string | null = null;
  role: string = '';
  address: Address = { longitude: 0, latitude: 0, place: '' };


  constructor(private router: Router, private socket: SocketService) {}
  onCategoryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.role = target.value;
    console.log('Selected category:', this.role);
  }

  ngAfterViewInit() {
    this.address = this.addressAutocomplete.getAddress();
  }

  onAddressChange(newAddress: Address) {
    console.log('Address changed:', newAddress);

    this.address = newAddress;
  }

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

    const capturedImage = canvas.toDataURL('image/png');

    if (this.step === 1) {
      this.idPhoto = capturedImage;
    } else if (this.step === 2) {
      this.personPhoto = capturedImage;
    }
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.isCameraOn = false;
      this.videoElement.nativeElement.srcObject = null;
    }
  }

  nextStep() {
    if (this.step === 1 && this.idPhoto) {
      this.step = 2;
    }
  }

  previousStep() {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  formData = {
    _id: '',
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    age: 0,
    id_card: 'example',
    photo_id: 'example',
    description: '',
    address: { longitude: 0, latitude: 0, place: '' },
    username: '',
  };

  onSubmit() {
    if (this.idPhoto && this.personPhoto) {
      console.log('Captured Image:', this.capturedImage);
    }
    this.formData._id = this.socket.UID;
    this.formData.role = this.role;
    this.formData.address = this.address;
    console.log('Form Data:', this.formData);
    this.socket.on('userCreated', (userData: AppUser) => {
      console.log(userData);
      this.socket.user = userData;
      if (this.socket.user.role == 'elder') {
        this.router.navigate([AppRoute.HOMEELDER]);
      } else if (this.socket.user.role == 'volunteer') {
        this.router.navigate([AppRoute.HOMEVOLUNTEER]);
      }
    });
    this.socket.send('createUser', this.formData);
  }

  onFileChange(event: Event) {
    console.log('file changed');
  }
}
