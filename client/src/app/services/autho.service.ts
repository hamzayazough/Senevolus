import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AppUser } from '../interfaces/app-user';
import { ProfileService } from './profile.service';
@Injectable({
  providedIn: 'root',
})
export class AuthoService {
  public loggedUser: BehaviorSubject<AppUser> = new BehaviorSubject<AppUser>(
    {} as AppUser
  );

  constructor(
    public auth0Service: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.auth0Service.user$.subscribe((user) => {
      if (user && user.sub) {
        this.profileService.getIfUserExist(user.sub).subscribe({
          next: (bdUser: any) => {
            if (!bdUser) {
              this.setUpUser(user);
            }
            this.setUser(bdUser);
          },
          error: (error: any) => {},
        });
      }
    });
  }
  get loggedUser$(): Observable<AppUser> {
    return this.loggedUser.asObservable();
  }

  public isAuthentificated: boolean = false;
  public isFirstLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  get isAuthenticated$() {
    return this.auth0Service.isAuthenticated$;
  }

  public logout() {
    this.auth0Service.logout();
    localStorage.removeItem('user');
    this.loggedUser.next({} as AppUser);
  }

  public getStoredUser(): AppUser | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  public getUser(): AppUser | null {
    if (this.loggedUser.value) {
      return this.loggedUser.value;
    }
    return this.getStoredUser();
  }

  private setUpUser(user: any) {
    const tempUsername = user.email.split('@')[0];
    const userInfo: AppUser = {
      _id: user.sub,
      email: user.email,
      description: '',
      username: user.username || tempUsername,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      photo_id: user.picture || '',
      age: 0,
      address: '',
      points: 0,
      role: '',
      id_card: '',
    };
    this.profileService.createUser(userInfo).subscribe({
      next: (user: AppUser) => {
        this.isFirstLogin.next(true);
        this.setUser(user);
      },
      error: (error: any) => console.error('Error creating user:', error),
    });
  }

  private setUser(user: AppUser): void {
    if (!user) {
      return;
    }
    this.loggedUser.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.profileService.setUser(user);
  }
}
