
import { FacebookLoginProvider,  AuthService,GoogleLoginProvider,SocialUser } from "angularx-social-login";
import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from "@angular/core";
import { AuthloginService } from "../../authlogin.service";
import { UtilityService } from "src/app/utility.service";
import { Router } from "@angular/router";
declare var FB: any;
declare const gapi: any;

@Component({
  selector: "app-social-login",
  templateUrl: "./social-login.component.html",
  styleUrls: ["./social-login.component.scss"]
})
export class SocialLoginComponent implements OnInit, AfterViewInit {
  public auth2: any;
  @ViewChild("googleBtn", { static: true }) googleBtn: ElementRef;
  private user: SocialUser;
  private loggedIn: boolean;
  session;
  loginError;
  socialLogin = {};
  isLoading;
  constructor(
    private element: ElementRef,
    private socialAuthService: AuthService,
    private service: AuthloginService,
    private utilityservice: UtilityService,
    private router: Router
  ) {
   // console.log("ElementRef: ", this.element);
    // console.log(this.googleBtn);
  }

  ngOnInit() {
   // this.isLoading = true;
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if(this.loggedIn){

      }
    });
  }
 
  ngAfterViewInit() {
    //this.googleInit();
  }
  signInWithFB() {
   this.isLoading = true;
     this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(data=>{
      let nameArr = data.name.split(' '),
    last_name = '';
   
    if(nameArr.length){
      this.socialLogin['first_name'] = (nameArr[0]) ? nameArr[0] : '';
      nameArr.splice(0, 1);
      last_name = nameArr.join(' ');
      this.socialLogin['last_name'] = last_name;
    }else{
      this.socialLogin['first_name'] = (data.name) ? data.name : '';
    }
    this.socialLogin['facebook_id'] = data.id;
    this.socialLogin['email'] =  data.email;
    this.socialLogin['image'] =  data.photoUrl;
    this.socialLogin['device_type'] = 3;
    this.socialLogin['facebook_access_token'] =  data.authToken;
      this.service.api('user/auth/login', this.socialLogin, 'login').subscribe(
        data=>{
          this.socialLogin = {};
          if(data.response_code ===200){
            data.data.login_date =  this.utilityservice.currentDateTime();
            data.data.login_type = 'social';
            //data.data.login_type = 'native';
            if (this.utilityservice.checkLocalStorageStatus('user')) {
              this.utilityservice.clearLocalStorage('user');
              this.utilityservice.setLocalStorage('user', data) ;
            } else {
              this.utilityservice.setLocalStorage('user', data) ;
            }
            //this.isLoggedIn = true ;
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
    });
   
  }
  signInWithGoogle() {
    this.isLoading = true;
   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(data=>{
    let nameArr = data.name.split(' '),
    last_name = '';
   
    if(nameArr.length){
      this.socialLogin['first_name'] = (nameArr[0]) ? nameArr[0] : '';
      nameArr.splice(0, 1);
      last_name = nameArr.join(' ');
      this.socialLogin['last_name'] = last_name;
    }else{
      this.socialLogin['first_name'] = (data.name) ? data.name : '';
    }
    this.socialLogin['google_id'] = data.id;
    this.socialLogin['email'] =  data.email;
    this.socialLogin['image'] =  data.photoUrl;
    this.socialLogin['device_type'] = 3;
    this.socialLogin['google_access_token'] =  data.idToken;
    this.service.api('user/auth/login',  this.socialLogin, 'login').subscribe(
      data=>{
        this.socialLogin = {};
        if(data.response_code ===200){
          data.data.login_date =  this.utilityservice.currentDateTime();
          data.data.login_type = 'social';
          //data.data.login_type = 'native';
          if (this.utilityservice.checkLocalStorageStatus('user')) {
            this.utilityservice.clearLocalStorage('user');
            this.utilityservice.setLocalStorage('user', data) ;
          } else {
            this.utilityservice.setLocalStorage('user', data) ;
          }
          //this.isLoggedIn = true ;
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
   });
    
 
  }


  signOut(): void {
    this.socialAuthService.signOut();
  }
}
