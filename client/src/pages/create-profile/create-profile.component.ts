import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../constants';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.scss'
})
export class CreateProfileComponent {
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
    console.log('Form Data:', this.formData);
    this.router.navigate([AppRoute.HOME])
  }

  onFileChange(event: Event) {
    console.log("file changed")
  }

  home
}
