import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, Auth } from 'firebase/auth';
import { SocketService } from '../../services/socket.service';
import { AppRoute } from '../constants';
import { AppUser } from '../../interfaces/app-user';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  email: string = '';
  password: string = '';
  isAuthenticated: boolean = false;
  private auth: Auth;

  constructor(
    private router: Router,
    private socket: SocketService,
  ) {
    this.auth = getAuth();
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      this.isAuthenticated = !!user;
    });
  }

  async login() {
    await signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        this.isAuthenticated = true;
        this.socket.UID=userCredential.user.uid;
        this.socket.connect();
        this.socket.initializeConnectEvents();
        this.socket.initializeFetchListEvents();
        this.socket.send("connect_getuser", this.socket.UID)
      })
      .catch((error) => {
        console.error('Login error:', error.message);
        alert(error.message);
      });
  }

  async createAccount() {
    await createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        this.isAuthenticated = true;
        this.socket.UID=userCredential.user.uid;
        this.socket.user.email != userCredential.user.email;
        this.socket.connect();
        this.router.navigate(['createProfile']);
      })
      .catch((error) => {
        console.error('Account creation error:', error.message);
        alert(error.message);
      });
  }

  logout() {
    this.socket.disconnect();
    signOut(this.auth)
      .then(() => {
        console.log('Logged out successfully');
        this.isAuthenticated = false;
        this.socket.UID = '';
        // Redirect or update UI
        //this.socket.disconnect();
      })
      .catch((error) => {
        console.error('Logout error:', error.message);
        alert(error.message);
      });
  }

  home() {
    if (this.socket.user.role == 'elder') {
      this.socket.send('getListElder')
      this.router.navigate([AppRoute.HOMEELDER])
    } else if (this.socket.user.role == 'volunteer') {
      this.socket.send('getListVolunteer')
      this.router.navigate([AppRoute.HOMEVOLUNTEER])
    }
  }
}
