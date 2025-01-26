import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, Auth } from 'firebase/auth';
import { SocketService } from '../../services/socket.service';

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

  onSubmit() {
    if (!this.email || !this.password) {
      alert('Email and Password are required.');
      return;
    }
    this.login();
  }
  

  login() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        //console.log('Logged in successfully:', userCredential.user);
        this.isAuthenticated = true;
        this.socket.UID=userCredential.user.uid;
        this.socket.connect();
      })
      .catch((error) => {
        console.error('Login error:', error.message);
        alert(error.message);
      });
  }

  createAccount() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((userCredential) => {
        //console.log('Account created successfully:', userCredential.user);
        this.isAuthenticated = true;
        this.socket.UID=userCredential.user.uid;
        this.socket.connect();
      })
      .catch((error) => {
        console.error('Account creation error:', error.message);
        alert(error.message);
      });
  }

  logout() {
    signOut(this.auth)
      .then(() => {
        console.log('Logged out successfully');
        this.isAuthenticated = false;
        this.socket.UID = '';
        // Redirect or update UI
        this.socket.disconnect();
      })
      .catch((error) => {
        console.error('Logout error:', error.message);
        alert(error.message);
      });
  }

  home(type: string) {
    if (type === 'home') {
      this.router.navigate(['/home']);
    } else {
      console.warn('Unknown home type');
    }
  }
}
