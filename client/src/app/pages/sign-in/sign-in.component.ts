import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoute } from '../constants';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private auth: AuthService,  // Ensure AuthService is injected
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Only perform Auth0 actions if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Check if the user is authenticated using Auth0
      this.auth.isAuthenticated$.subscribe((authenticated) => {
        this.isAuthenticated = authenticated;
      });
    }
  }

  home(address: string): void {
    this.router.navigate([address]);
  }

  // Handle login with redirect in client-side context
  login(): void {
    if (typeof window !== 'undefined') {
      this.auth.loginWithRedirect();
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      this.auth.logout();
    }
  }
}
