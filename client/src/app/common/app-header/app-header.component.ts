import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  get type() {
    return this.socket.user.role;
  }

  get points() {
    return this.socket.user.points
  }
  constructor(
    private router : Router,
    private socket : SocketService
  ) {
  }

  navigate(adress : string) {
    this.router.navigate([adress]);
  }
}
