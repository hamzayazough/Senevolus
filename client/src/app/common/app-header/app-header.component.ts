import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  type: string = "elder";

  constructor(
    private router : Router,
    private socket : SocketService
  ) {
    this.type = this.socket.user.role;
  }

  navigate(adress : string) {
    this.router.navigate([adress]);
  }
}
