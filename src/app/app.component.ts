import {Component, OnInit} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  user: SocialUser;
  loggedIn: boolean;

  constructor(private socialAuthService: SocialAuthService){
    this.user = new SocialUser();
    this.loggedIn = false;
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.loggedIn = (user != null);
    });
  }

  signInWithGoogle(): void{
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(error => console.log(error));
  }

  signOut(): void{
    this.socialAuthService.signOut().catch(error => console.log(error));
  }
}
