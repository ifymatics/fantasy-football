import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthloginService } from '../user/authlogin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FanshopService } from '../fanshop/fanshop.service';
import { UtilityService } from '../utility.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { first } from 'rxjs/Operators';

@Component({
  selector: 'app-modal-get-token',
  templateUrl: './modal-get-token.component.html',
  styleUrls: ['./modal-get-token.component.scss']
})
export class ModalGetTokenComponent implements OnInit {
  @ViewChild('getToken', { static: false }) getToken: ModalDirective;
  //@Input() parentSubject:Subject<any>;;
user;
currentUser;
session;
disabled ;
userId;
message=false;
deviceType;
tokenObj = {price: 100, unit: 1};
token = this.tokenObj.unit * this.tokenObj.price;
userbalance = {real_amount : 0, winning_amount : 0, bonus_amount : 0, point_balance : 0, token: 0};
constructor(  private router: Router,private route: ActivatedRoute,
    private service: AuthloginService, private fanshopservice: FanshopService,
    public deviceService: DeviceDetectorService, private utilityservice: UtilityService){}
  ngOnInit(){
    if(this.deviceService.isMobile())
    this.deviceType =true;
    const user  = this.utilityservice.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    this.fanshopservice.getTokenSubject
    .subscribe(event => {
       if(event.action) this.message = true;  //this.getToken.show()
      });
  }
 
 close(){
  //this.fanshopservice.getTokenSubject.unsubscribe();
  this.message = false; 
  // this.ngOnDestroy()

 }

  calculateToken(arg) {
    if (arg === 'increase') {
      this.tokenObj.unit += 1;
      this.token = this.tokenObj.unit * this.tokenObj.price;
    // console.log(this.tokenObj.unit);
    } else if (arg === 'reduce') {
     if (this.tokenObj.unit > 1) {
      this.tokenObj.unit -= 1;
      this.token = this.tokenObj.unit * this.tokenObj.price;
      // console.log(this.tokenObj.unit);
      // console.log(this.tokenObj.unit * this.tokenObj.price);
     }
    }
  
  }
  buyToken(arg?) {
    this.disabled = true;
    // console.log(this.token);
    // console.log(this.tokenObj.unit);
    if (this.token) {
      // console.log(this.router.url);
      const param = {
        'amount': this.token,
        'sports_id': 5,
        'token':  this.tokenObj.unit,
        'return_url': this.router.url
    };
    let url = 'user/paystack/deposit';
    if (arg === 'subscription') {
      url = 'user/paystack/subscription';
    }
    this.service.api(url , param, 'POST', this.session)
    .subscribe((response) =>{
        if (response.response_code === 200) {
         // this.disabled = false;
           //console.log(response);
            window.location.href = response.data.authorization_url;
        }
    }, (error) => {
      this.disabled = false;
        console.log(error);
        // emitAlert.on(display, 'danger');
    });
    }
  }

}
