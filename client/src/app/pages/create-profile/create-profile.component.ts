import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../constants';
import { SocketService } from '../../services/socket.service';
import { AppUser } from '../../interfaces/app-user';
import { AddressAutocompleteComponent } from '../../common/address-autocomplete/address-autocomplete.component';
import { Address } from '../../interfaces/address';
import { FileUploadService } from '../../services/file-upload.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss'],
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

  // Reactive form for address and biography
  personalInfoForm: FormGroup;
  addressBioForm: FormGroup;

  constructor(
    private router: Router,
    private socket: SocketService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {

    this.personalInfoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(1)]],
      role: ['', Validators.required],
    });

    // Initializing the reactive form with required fields
    this.addressBioForm = this.fb.group({
      biography: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.address = this.addressAutocomplete.getAddress();
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.role = target.value;
    console.log('Selected category:', this.role);
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

  takePicture(format: 'image/png' | 'image/jpeg' = 'image/png'): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
  
    if (!video || !canvas || !context) {
      console.error('Video or canvas element not found');
      return;
    }
  
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    const capturedImage = canvas.toDataURL(format);
  
    if (this.step === 1) {
      this.idPhoto = capturedImage;
    } else if (this.step === 2) {
      this.personPhoto = capturedImage;
    } else {
      console.error('Invalid step value');
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
  

  onSubmit(): void {
    if (
      this.idPhoto &&
      this.personPhoto &&
      this.personalInfoForm.valid &&
      this.addressBioForm.valid
    ) {
      const idPhotoFile = this.dataURLtoFile(this.idPhoto, 'idPhoto.png');
      const personPhotoFile = this.dataURLtoFile(this.personPhoto, 'personPhoto.png');

      this.profileService.validateUser(idPhotoFile, personPhotoFile).subscribe(
        (response) => {
          console.log('Validation successful:', response);

          // Prepare the formData object with all required fields
          this.formData._id = this.socket.UID;
          this.formData.role = this.personalInfoForm.get('role')?.value;
          this.formData.firstName = this.personalInfoForm.get('firstName')?.value;
          this.formData.lastName = this.personalInfoForm.get('lastName')?.value;
          this.formData.age = this.personalInfoForm.get('age')?.value;
          this.formData.description = this.addressBioForm.get('biography')?.value;
          this.formData.address = this.address;

          // Upload the images and submit the formData
          this.fileUploadService.uploadPhotos(idPhotoFile, personPhotoFile).subscribe(
            (uploadResponse) => {
              console.log('Upload successful:', uploadResponse);
              this.submitFormData(); // Proceed with submitting the form
            },
            (uploadError) => {
              console.error('Upload failed:', uploadError);
            }
          );
        },
        (error) => {
          console.error('Validation failed:', error);
        }
      );
    } else {
      console.error('All fields, including photos and biography, are required.');
    }
  }         
  
  submitFormData() {
    // Submit the formData to the backend
    this.socket.on('userCreated', (userData: AppUser) => {
      console.log('User created successfully:', userData);
      this.socket.user = userData;
      this.socket.initializeFetchListEvents();
  
      // Redirect based on the user's role
      if (this.socket.user.role === 'elder') {
        this.router.navigate([AppRoute.HOMEELDER]);
      } else if (this.socket.user.role === 'volunteer') {
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
