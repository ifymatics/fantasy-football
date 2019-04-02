// import { AuthloginService } from './../authlogin.service';
import { UtilityService } from './../../utility.service';
import { ModalService } from './../../modal.service';
import { Router } from '@angular/router';
import { md5 } from './../md5';
import { Component, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
 import { AuthloginService } from '../../user/authlogin.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
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
  loginError = {email: '', password: ''};
  isLoading = false;
  noNetwork;
  btnDisabled = true;
  loggedIn;
  isLoggedIn = false;
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
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
     });
    /*const invalid = [];
    const controls = this.loginForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
          //  invalid.push(name);
         console.log( this.loginForm.Validators);
        }
    }
    return invalid;*/
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
   this.service.api('user/auth/login', this.hashing, 'login')
  .subscribe(
    (data) => {
       // {
          if (data.response_code === 200) {
             console.log(data.data.session_key);
          if (this.loginForm.value.rememberMe === true) {
             this.utilityservice.setSession('remember', {email: this.hashing.email, remember: this.loginForm.value.rememberMe});
          } else {
           this.utilityservice.clearSession('remember');
           // this.utilityservice.clearLocalStorage('user');
          }
          data.data.login_date =  this.utilityservice.currentDateTime();
           console.warn(data.data);
          data.data.login_type = 'native';
          this.utilityservice.clearLocalStorage('user');
          this.utilityservice.setLocalStorage('user', data) ;
          (this.utilityservice.getLocalStorage('user').data.session_key  !== null) ?
          this.isLoggedIn = true :
          this.isLoggedIn = false;
          this.user = this.utilityservice.getLocalStorage('user');
           // if (this.user !== false) {
           this.session = data.data.session_key; // this.user.data.session_key;
          this.service.api('user/my_profile/header_detail' , {}, 'post', this.session)
          .subscribe(
            data1 => {
              data['data'].user_profile.sports = data1['data'].sport;
              // console.warn(data['data']['session_key']);
               console.warn(this.utilityservice.getLocalStorage('user'));
              for (const i of data1['data']['sport']) {
               // console.warn(data1['data'].sport);
               const sportId = (globalSport) ? globalSport : '';
               console.log( data1['data']['sport'][0].sports_id);
               const id = data1['data']['sport'][0].sports_id;
               if ( data1['data']['sport'][0].sports_id/*sportId*/) {
                 const selectedSports = data1['data']['sport'];
                 selectedSports.format_type = 'daily';
                 selectedSports.selected_sports_id = globalSport;
                 setTimeout(() => {
                   // this.utilityservice.clearLocalStorage('user');
                      this.router.navigate([id + '/league']);
                 }, 300);
               }
              }
            },
            (error) => {
              console.log(error['error']); alert(error['error']);
               this.isLoading = false; }
          );
           // this.router.navigate(['/league']);
          }
   },
    (error) => {
      this.isLoading = false;
       console.log(error.error);
       this.loginError = error.error.error;
   // this.isLoading = false;
    }
  );
   // this.service.login(this.hashing, globalSport, this.loginForm);
   // tslint:disable-next-line:no-trailing-whitespace*/
  }
   showSignup() {
    this._modalservice.hideLogin();
    this._modalservice.showSignup();
  }
  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  signInWithLinkedIn(): void {
    this.socialAuthService.signIn(LinkedInLoginProvider.PROVIDER_ID);
  }
  logout() {
    this.service.logout();
  }
}
