import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser } from '../interfaces/app-user';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl: string = environment.apiUrl + '/profile';
  public user$: BehaviorSubject<AppUser | null> =
    new BehaviorSubject<AppUser | null>(null);

  constructor(private http: HttpClient) {}
  setUser(user: AppUser): void {
    this.user$.next(user);
  }

  public createUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(this.baseUrl, user);
  }

  public getIfUserExist(userId: string): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.baseUrl}/${userId}`);
  }

  public updateUser(user: AppUser): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.baseUrl}/${user.id}`, user);
  }
}
