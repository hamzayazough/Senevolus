import { Injectable } from '@angular/core';
import { accessToken } from './constant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private baseUrl: string =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  private accessToken: string = accessToken;

  constructor(private http: HttpClient) {}

  searchPlace(query: string): Observable<any> {
    const url = `${this.baseUrl}${query}.json?access_token=${this.accessToken}&autocomplete=true&limit=5`;
    return this.http.get(url);
  }
}
