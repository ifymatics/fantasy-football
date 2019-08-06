import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { AuthloginService } from './../../user/authlogin.service';
import { UtilityService } from './../../utility.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
id;
league_id;
blue = false;
toggle = false;
mobile = false;
menuHeader = '';
menuHeaderArrray = [];
navbars = '';
deactivate = 'deactivate';
session;
currentUser;
selectedSport = { sport_id: 5};
user_balance;
currentBalance;
point_balance;
user;
tag;
message;
paymentStatus = {status: ''};
tokenObj = {price: 100, unit: 1};
token = this.tokenObj.unit * this.tokenObj.price;
disabled = false;
@Input('condition')condition;
  constructor(private utilityservice: UtilityService, private utilityService: UtilityService,
     private service: AuthloginService, private router: Router, private route: ActivatedRoute,
     private dataservice: DataService, public deviceService: DeviceDetectorService) { }

  ngOnInit() {
    
    this.utilityservice.logout.subscribe(
      data => (data === 'logout') ? this.logout() : ''
      );
    // this. showMenu();
    this.route.params.subscribe(
      (params: ParamMap) => {
         this.id = +params['id'];
         this.league_id = +params['league_id'];
         // console.log(this.league_id);
      }
    );
    this.route.queryParams.subscribe(
      (queryParams) => {
        if (!queryParams['status']) {
          this.paymentStatus.status = '';
        } else {
          this.paymentStatus.status = queryParams['status'];
        }
        // this.paymentStatus.status = queryParams['status'] ?
        // queryParams['status'] : '';
      }
     );
     if (this.paymentStatus.status !== '') {
      if (this.paymentStatus.status === 'success' || this.paymentStatus.status === 'completed' ) {
  
                  // emitAlert.on("Fund added successfully", 'success');
                  this.message = 'Token added successfully';
                  this.tag = 'success';
      } else if (this.paymentStatus.status === 'subscribed') {
        this.message = 'You have successfully subscribed for a month premium access with a 5 token bonus';
        this.tag = 'success';
     } else if (this.paymentStatus.status === 'failure') {
         // emitAlert.on("Payment failure. Try again !!", 'danger');
         this.message = 'Payment failure. Try again !!';
         this.tag = 'danger';
      } else if (this.paymentStatus.status === 'pending') {
        this.message = 'Your request has been sent to paypal, your order status will update soon.';
         this.tag = 'info';
         // emitAlert.on("Your request has been sent to paypal, your order status will update soon.", 'info');
      }
     }
    if (this.utilityService.checkLocalStorageStatus('user')) {
      this.user = this.utilityService.getLocalStorage('user');
      this.currentUser = this.user.data.user_profile;
     this.session = this.user.data.session_key;
     console.log(this.currentUser);
     }
     this.getUserBalance () ;
  }
  showMenu() {
    if (this.navbars === 'active') {
      this.navbars = '';
      this.deactivate = 'deactivate';
    } else {
      this.navbars = 'active';
      this.deactivate = '';
    }
    // this.menuHeader = '';
    if (this.menuHeader === 'active') {
      this.menuHeader = '';
    } else {
      this.menuHeader = 'active';
    }
  //  this.menuHeaderArrray.push(this.menuHeader);
  // console.warn(this.menuHeader);
 }
  logout() {
   // console.log('from eventemitter');
    this.service.logout();
  }
  onNavigate() {
    this.router.navigate([this.id + '/lobby']);
  }
  getUserBalance () {
    const param = {
      'user_id': this.currentUser.user_id
     };
  this.service.api('user/finance/get_user_balance', param, 'POST', this.session)
  .subscribe(
    (response) => {
     console.log(response.data);
     const  currentBalance = response.data.user_balance.real_amount;
      this.user_balance =  response.data.user_balance;
      this.point_balance  = parseFloat(this.user_balance.point_balance);
      this.currentBalance = Number(currentBalance);
     this.dataservice.userBalance.emit(this.user_balance);
    },
    (error) => {
      if (error['error']['global_error'] === 'Session key has expired') {
        this.message = error['error']['global_error'];
        this.tag = 'danger';
        setTimeout(() =>  this.router.navigate(['/']) , 5000);
      // this.router.navigate(['/']);
      }
    }
  );

  }
   addFund() {
    const  userDetail = this.user;
    if (!userDetail.user_profile.dob || !userDetail.user_profile.email || !userDetail.user_profile.first_name) {
       //  $rootScope.profileCmpltAlertModalInit();
       alert('update your profile first');
       this.router.navigate(['']);
       // navigate to profile
        return true;
    } else {
      this.router.navigate(['']);
       // $state.go('root.finance.deposit',{sports_id: this.selectedSport.sports_id});
        return false;
    }
}
onRoute(arg?) {
  console.log('begin');
 if (arg === 'mycontest') this.router.navigate(
  ['/'+ this.selectedSport.sport_id + '/'+ this.league_id+'/my-league']
 )
 if (arg === 'lobby') 
 this.router.navigate(
  ['/'+ this.selectedSport.sport_id + '/' +  this.league_id + '/lobby']
 )
 if (arg === 'leaderboard') this.router.navigate(
  ['/'+ this.selectedSport.sport_id + '/leaderboard']
 );
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
  //console.log(this.token);
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
        // console.log(response);
          window.location.href = response.data.authorization_url;
      }
  }, (error) => {
    this.disabled = false;
      console.log(error);
      // emitAlert.on(display, 'danger');
  });
  }
}
closeAlert() {
  this.message = null;
  this.paymentStatus.status = '';
  }
}
