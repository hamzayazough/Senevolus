import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  type: string = "";

  constructor(
    private router : Router,
    private authService : AuthService
  ) {
    this.type = this.authService.userType;
  }

  navigate(adress : string) {
    this.router.navigate([adress]);
  }
}
