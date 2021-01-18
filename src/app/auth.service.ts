import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;
  accessToken: any;
  refreshToken: any;
  refreshTokenInterval: number;
  signInUrl = 'http://127.0.0.1:8000/auth/google/';
  signOutUrl = 'http://127.0.0.1:8000/auth/logout/';
  tokenRefreshUrl = 'http://127.0.0.1:8000/auth/token/refresh/';

  constructor(private http: HttpClient) {
    this.accessToken = null;
    this.refreshToken = null;
    this.refreshTokenInterval = 300000;
  }

  callUserSignIn(): Observable<any> {
    return this.http.post(this.signInUrl, {
      access_token: this.user.authToken
    });
  }

  callUserSignOut(): Observable<any> {
    return this.http.post(this.signOutUrl, {refresh: this.refreshToken});
  }

  setTokens(access: string, refresh: string): void {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  resetTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }

  callTokenRefresh(): Observable<any> {
    return this.http.post(this.tokenRefreshUrl, {refresh: this.refreshToken});
  }

  refreshTokens(newToken: any): void {
    console.log(newToken);
    // updating the new access token
    this.accessToken = newToken.access;
    // getting the expiration time and current time
    const accessTokenExpirationTime = new Date(newToken.access_token_expiration);
    const now = new Date();
    // calculating how much time is remaining before expiration and setting the interval 10% before expiration
    this.refreshTokenInterval = accessTokenExpirationTime.getTime() - now.getTime();
    this.refreshTokenInterval = this.refreshTokenInterval - this.refreshTokenInterval * .1;
    console.log('refresh interval: ' + this.refreshTokenInterval / 60000 + ' mins');
  }
}
