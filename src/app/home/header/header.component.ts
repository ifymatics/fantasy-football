import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { AuthloginService } from './../../user/authlogin.service';
import { UtilityService } from './../../utility.service';
import { Component, OnInit } from '@angular/core';

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

  constructor(private utilityservice: UtilityService, private utilityService: UtilityService,
     private service: AuthloginService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // this. showMenu();
    this.route.params.subscribe(
      (params: ParamMap) => {
         this.id = +params['id'];
         this.league_id = params['league_id'];
         console.log(this.league_id);
      }
    );
    if (this.utilityService.checkLocalStorageStatus('user')) {
      this.user = this.utilityService.getLocalStorage('user');
      this.currentUser = this.user.data.user_profile;
     this.session = this.user.data.session_key;
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
   console.warn(this.menuHeader);
 }
  logout() {
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
      console.log(response.data.user_balance);
     const  currentBalance = response.data.user_balance.real_amount;
      this.user_balance =  response.data.user_balance;
      this.point_balance  = parseFloat(this.user_balance.point_balance);
      this.currentBalance = Number(currentBalance);

    },
    (error) => {

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
}
