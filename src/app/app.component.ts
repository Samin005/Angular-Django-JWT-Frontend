import {Component, OnInit} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: any;
  secretData = {name: '', value: ''};

  constructor(private http: HttpClient,
              private socialAuthService: SocialAuthService,
              private authService: AuthService) {
    this.user = null;
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
      if (user != null) {
        this.http.post('http://127.0.0.1:8000/auth/google/', {
          access_token: this.user.authToken
        }).subscribe((response: any) => {
          this.authService.accessToken = response.key;
          if (Swal.isVisible()) {
            Swal.fire({
              icon: 'success',
              title: 'Sign-in Success!',
              text: 'Welcome, ' + this.user.name,
              showConfirmButton: false,
              timer: 1000
            }).finally();
          }
        }, (error) => console.log(error));
      }
    });
  }

  signInWithGoogle(): void {
    Swal.fire({title: 'Signing-in with Google...'}).finally();
    Swal.showLoading();
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(error => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: error.error,
        timer: 2000
      }).finally();
    });
  }

  signOut(): void {
    Swal.fire({title: 'Signing-out...'}).finally();
    Swal.showLoading();
    this.http.post('http://127.0.0.1:8000/auth/logout/', {}).subscribe(
      (response) => {
        console.log(response);
        this.socialAuthService.signOut()
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Sign-out Success!',
              showConfirmButton: false,
              timer: 1000
            }).finally();
          })
          .catch(error => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: error.error
            }).finally();
          });
      }, (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: error.message
        }).finally();
      });
  }

  requestSecretData(): void {
    Swal.showLoading();
    this.http.get('http://127.0.0.1:8000/secret/').subscribe(
      (response: any) => {
        console.log(response);
        this.secretData = response;
        Swal.fire({
          icon: 'info',
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
