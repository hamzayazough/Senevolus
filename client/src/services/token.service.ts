import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private cachedToken: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor(private auth0Service: AuthService) {
    this.auth0Service.idTokenClaims$
      .pipe(
        switchMap((claims) => {
          if (claims?.__raw) {
            this.cachedToken.next(claims.__raw);
            return of(claims.__raw);
          }
          return this.auth0Service.getAccessTokenSilently({
            authorizationParams: {
              audience: 'https://dev-ibta2mockraiqpl3.us.auth0.com/api/v2/',
            },
          });
        }),
        catchError((error) => {
          console.error('Error fetching token silently:', error);
          return of(null);
        })
      )
      .subscribe((token) => {
        this.cachedToken.next(token);
      });
  }

  getToken$() {
    return this.cachedToken.asObservable();
  }
}
