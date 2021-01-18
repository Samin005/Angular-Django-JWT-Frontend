import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  accessToken: any;
  refreshToken: any;

  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
  }
}
