import {Component, OnInit} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: SocialUser;
  loggedIn: boolean;
  authHeader: HttpHeaders;
  secretData = {name: '', value: ''};

  constructor(private http: HttpClient,
              private socialAuthService: SocialAuthService) {
    this.user = new SocialUser();
    this.loggedIn = false;
    this.authHeader = new HttpHeaders();
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        this.http.post('http://127.0.0.1:8000/auth/google/', {
          access_token: this.user.authToken
        }).subscribe((response: any) => {
          console.log(response);
          this.authHeader = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Token ' + response.key
          });
        }, (error) => console.log(error));
      }
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(error => console.log(error));
  }

  signOut(): void {
    this.http.post('http://127.0.0.1:8000/auth/logout/', {}, {headers: this.authHeader}).subscribe(
      (response) => {
        console.log(response);
        this.authHeader = new HttpHeaders();
        this.socialAuthService.signOut().catch(error => console.log(error));
      }, (error) => console.log(error));
  }

  requestSecretData(): void {
    this.http.get('http://127.0.0.1:8000/secret/', {headers: this.authHeader}).subscribe(
      (response: any) => {
        console.log(response);
        this.secretData = response;
        Swal.fire({
          icon: 'success',
          title: this.secretData.name + ':',
          text: this.secretData.value
        }).finally();
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: error.message
        }).finally();
      }
    );
  }
}
