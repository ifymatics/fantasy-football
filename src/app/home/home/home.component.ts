import { ModalService } from './../../modal.service';
import { md5 } from './../../user/md5';
import { Component, OnInit, Output , EventEmitter, ViewChild, HostListener} from '@angular/core';
import { AuthloginService } from '../../user/authlogin.service';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
// import { EventEmitter } from 'events';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ImageUrlDesktop = 'assets/image/bg-1-dark.jpg';
  ImageUrlMobile = 'assets/image/bg-1-mobile.jpg';

  @ViewChild('carousel', { static: false }) public el: any;

 @HostListener('swipeleft', ['$event']) public swipePrev(event: any) {
  this.el?this.el.previousSlide():'';
 }

 @HostListener('swipeup', ['$event']) public swipeNext(event: any) {
   this.el.nextSlide();
 }
 queryObj = {key: '', activation_key: ''};
 message;
 tag;
  constructor(private _modalservice: ModalService,private service: AuthloginService,
     public deviceService: DeviceDetectorService, private route: ActivatedRoute) { }

  ngOnInit() {
  
    this.route.queryParams.subscribe(
      (query) => {
        if(query['key']){
          this.queryObj.key = query['key'];
          this.validateForgotCode('key');
        }
        if(query['activation_key']){
          this.queryObj.activation_key = query['activation_key'];
          this.validateForgotCode('activation_key');
        }
      }
    );
    this.getImageUrl();
    //console.log(this.deviceService.isDesktop());
  }
  getImageUrl(){
    if(this.deviceService.isDesktop()){
      return "url(" + this.ImageUrlDesktop + ")";
    }
   
    return "url(" + this.ImageUrlMobile + ")";
  }
  showModal(modal?) {
    if (modal === 'loginmodal') {
     this._modalservice.showLogin();
    } else if (modal === 'signupmodal') {
      this._modalservice.showSignup();
    }else{
      // show modal to input email for reset password
    }
  }
  validateForgotCode = (arg) =>{
    if(arg ==='key'){
      const forgotCodeObj = {
        'key': this.queryObj.key
    };
  this.service.api('user/auth/forgot_password_validate_code', forgotCodeObj, 'POST')
  .subscribe((response) => {
        if (response.response_code === 200) {
           // show modal for reseting password

        }
    }, (error) => {
        // alert((error.error['key']) ? error.error['key'] : MessageService.getMessage('session_expired'), 'danger');
    });

    }else if(arg === 'activation_key'){
     
        let activationKeyObj = {
            "key": this.queryObj.activation_key
        };
        this.service.api('user/auth/activate_account', activationKeyObj, 'POST').subscribe((response) =>{
            if (response.response_code === 200) {
              this.message = response.message;
              this.tag=  'success' ;
              setTimeout(()=>this.closeAlert(),4000);
            }
        }, (error) =>{
            //UtilityService.removeQueryString();
            if(error.error['key']){
              this.message = `Your activation key [${error.error['key']}] is invalid`;
            }else{
              this.message = 'session_expired';
              this.tag='danger'
            }
         
        });
   
    }
  
 }
 ;

 closeAlert(){
   //check if there is activation code, then show login modal, else check if there is a validate password
   // then show reset password modal
   this.message = null;
   this._modalservice.showLogin();
 }
}
