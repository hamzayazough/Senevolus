import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(
    private router : Router, 
    private socket : SocketService
  ){}

  get firstName(){
    return this.socket.user.firstName;
  }
  get lastName(){
    return this.socket.user.lastName;
  }
  get email(){
    return this.socket.user.email;
  }
  get age(){
    return this.socket.user.age;
  }
  get description(){
    return this.socket.user.description;
  }
}
