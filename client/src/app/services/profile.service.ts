import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser } from '../interfaces/app-user';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl: string = environment.serverUrl + '/api/users';
  public user$: BehaviorSubject<AppUser | null> =
    new BehaviorSubject<AppUser | null>(null);

  constructor(private http: HttpClient) {}

  public validateUser(idCard: File, faceImage: File): Observable<any> {
    const formData = new FormData();
    formData.append('id_card', idCard);
    formData.append('face_image', faceImage);

    return this.http.post<any>(`${this.baseUrl}/validate`, formData);
  }


  public createUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(this.baseUrl, user);
  }

  public getIfUserExist(userId: string): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.baseUrl}/${userId}`);
  }

}
