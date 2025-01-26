import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../constants';
import { SocketService } from '../../services/socket.service';
import { AppUser } from '../../interfaces/app-user';
import { AddressAutocompleteComponent } from '../../common/address-autocomplete/address-autocomplete.component';
import { Address } from '../../interfaces/address';
import { FileUploadService } from '../../services/file-upload.service';

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

  constructor(
    private router: Router,
    private socket: SocketService,
    private fileUploadService: FileUploadService
  ) {}
  onCategoryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.role = target.value;
    console.log('Selected category:', this.role); // You can use this variable as needed
  }

  ngAfterViewInit() {
    this.address = this.addressAutocomplete.getAddress();
  }

  onAddressChange(newAddress: Address) {
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
      // Convert dataURL to File objects
      const idPhotoFile = this.dataURLtoFile(this.idPhoto, 'idPhoto.png');
      const personPhotoFile = this.dataURLtoFile(this.personPhoto, 'personPhoto.png');
  
      // Upload the files using the FileUploadService
      this.fileUploadService.uploadPhotos(idPhotoFile, personPhotoFile).subscribe(
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
  
  submitFormData() {
    this.formData._id = this.socket.UID;
    this.formData.role = this.role;
    this.formData.address = this.address;
  
    this.socket.on('userCreated', (userData: AppUser) => {
      console.log(userData);
      this.socket.user = userData;
      this.socket.initializeFetchListEvents();
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
  dataURLtoFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], filename, { type: mime });
  }
}
