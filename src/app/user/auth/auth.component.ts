import { ActivatedRoute } from '@angular/router';
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


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
 @ViewChild('loginmodal', { static: true }) loginmodal: ModalDirective;
 //@ViewChild('usermail', { static: true }) usermail: HTMLElement;
  loginForm;
  session;
  loginError = {email: '', password: ''};
  isLoading = false;
  noNetwork;
  btnDisabled = true;
  loggedIn;
  isLoggedIn = false;
  text = 'password';
  usermail;
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
   queryObj = {key: '', activation_key: ''};
  constructor(private service: AuthloginService, private socialAuthService: AuthService,
    private _modalservice: ModalService, private router: Router, private route: ActivatedRoute,
    private utilityservice: UtilityService ) { }

  ngOnInit() {
    this._modalservice.setLogin(this.loginmodal);
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
      'rememberMe': new FormControl(null)
    });
    this.usermail = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
     });
  
  }
  getusermail(){

  }
  forgotPassword(){
    let forgotObj={email:this.usermail.value };
    //console.log(this.usermail.value)
    this.service.api('user/auth/forgot_password', this.usermail.value, 'POST').subscribe((response)=> {
      if (response.response_code === 200) {
         
         //alert('success')
      }
    },
    error=>{
     console.log(error);
    }
    );  
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
            // console.log(data.data.session_key);
          if (this.loginForm.value.rememberMe === true) {
             this.utilityservice.setSession('remember', {email: this.hashing.email, remember: this.loginForm.value.rememberMe});
          } else {
           this.utilityservice.clearSession('remember');
           // this.utilityservice.clearLocalStorage('user');
          }
          data.data.login_date =  this.utilityservice.currentDateTime();
          // console.warn(data.data);
          data.data.login_type = 'native';
          if (this.utilityservice.checkLocalStorageStatus('user')) {
            this.utilityservice.clearLocalStorage('user');
            this.utilityservice.setLocalStorage('user', data) ;
          } else {
            this.utilityservice.setLocalStorage('user', data) ;
          }
          this.isLoggedIn = true ;
          this.router.navigate([ '/home']);
         //  this.user = this.utilityservice.getLocalStorage('user');
           // if (this.user !== false) {
           this.session = data.data.session_key; // this.user.data.session_key;
          
          }
      },
    (error) => {
      this.isLoading = false;
       console.log(error);
       this.loginError = error.error.error;
   // this.isLoading = false;
    }
  );
   // this.service.login(this.hashing, globalSport, this.loginForm);
   // tslint:disable-next-line:no-trailing-whitespace*/
  }
  showPassword(arg){
    if(arg)
    this.text = 'text';
    else this.text = 'password';
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
  validateForgotCode = () =>{
   const forgotCodeObj = {
        'key': this.queryObj.key
    };
  this.service.api('user/auth/forgot_password_validate_code', forgotCodeObj, 'POST', this.session)
  .subscribe((response) => {
        if (response.response_code === 200) {
           // vm.ResetPwdModalInit();
        }
    }, (error) => {
        // alert((error.error['key']) ? error.error['key'] : MessageService.getMessage('session_expired'), 'danger');
    });
}
;
onCut(){
  this.isLoading = false;
  this.loginmodal.hide();
}
}
