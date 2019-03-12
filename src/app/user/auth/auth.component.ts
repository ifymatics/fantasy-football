// import { AuthloginService } from './../authlogin.service';
import { UtilityService } from './../../utility.service';
import { ModalService } from './../../modal.service';
import { Router } from '@angular/router';
import { md5 } from './../md5';
import { Component, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
 import { AuthloginService } from '../../user/authlogin.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider,
  VkontakteLoginProvider,
  LinkedinLoginProvider
} from 'angular-6-social-login-v2';
import { ModalDirective } from 'angular-bootstrap-md';
import { timeout } from 'q';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
 @ViewChild('loginmodal') loginmodal: ModalDirective;
  loginForm;
  session;
  isLoading = false;
  noNetwork;
  /*form: {email: string, password: string, device_type: number} = {
    email: null,
    password: null,
    device_type: 3
   };*/
   hashing: {email: string, password: string, device_type: number} = {
     email: null,
     password: null,
     device_type: 3
   };
   user;
  constructor(private service: AuthloginService, private socialAuthService: AuthService,
    private _modalservice: ModalService, private router: Router,
    private utilityservice: UtilityService ) { }

  ngOnInit() {
    this._modalservice.setLogin(this.loginmodal);
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
      'rememberMe': new FormControl(null)
    });
  }
  onSubmit() {
    this.isLoading = true;
    setTimeout(() => {
      this.noNetwork = false;
      // this.utilityservice.clearLocalStorage('user');
      this.isLoading = false;
      this.noNetwork = true;
    }, 12000);
  // console.warn(this.loginForm.value.rememberMe);
  this.utilityservice.clearLocalStorage('user');
    this.hashing.password = md5(this.loginForm.value.password);
    this.hashing.email = this.loginForm.value.email;
    // console.log( this.hashing.password);
   const globalSport = this.utilityservice.getLocalStorage('globalSport');
   this.service.login(this.hashing, globalSport, this.loginForm);
   // tslint:disable-next-line:no-trailing-whitespace*/
   }
   showSignup() {
    this._modalservice.hideLogin();
    this._modalservice.showSignup();
  }
   public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'linkedin') {
      socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'vkontakte') {
      socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + '  sign in data : ' , userData);
        // Now sign-in with userData
      }
    );
  }
  logout() {
    this.service.logout();
  }
}
