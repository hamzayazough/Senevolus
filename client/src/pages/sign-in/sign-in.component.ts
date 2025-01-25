import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../constants';
import { AuthBtnComponent } from '../../app/auth-btn/auth-btn.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  constructor(private router: Router) {}

  home(adress: string) {
    this.router.navigate([adress]);
  }
}
