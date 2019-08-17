import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { AuthService } from 'angularx-social-login';
import { ShoppingCart } from 'src/app/fanshop/shared/models/shopping-cart';
import { AppUser } from 'src/app/fanshop/shared/models/app-user';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/fanshop/shared/services/auth.service';
import { ShoppingCartService } from 'src/app/fanshop/shared/services/shopping-cart.service';
import { UtilityService } from 'src/app/utility.service';
import { FanshopService } from 'src/app/fanshop/fanshop.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { DeviceDetectorService } from 'ngx-device-detector';
// import { longStackSupport } from 'q';

@Component({
// tslint:disable-next-line: component-selector
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnInit {
  blue = false;
  isActive = [];
  // selectedProduct: object;
  mobileNav = false;
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;
  menu = false;
  navbars = false;
  noNavbar = true;
  appUser: AppUser;
  paymentStatus = {status: ''};
  message;
  tag;
  user;
  currentUser;
  session;
  tokenObj = {price: 100, unit: 1};
  token = this.tokenObj.unit * this.tokenObj.price;
  userbalance = {real_amount : 0, winning_amount : 0, bonus_amount : 0, point_balance : 0, token: 0};
  cart$: Observable<ShoppingCart>;
  disabled = false;

  constructor(private auth: AuthService,
     private shoppingCartService: ShoppingCartService,
      private utilityservice: UtilityService,
      private fanservice: FanshopService,
      private router: Router,private route: ActivatedRoute,
      private service: AuthloginService,
      public deviceService: DeviceDetectorService) {
  }

  async ngOnInit() {
    this.fanservice.userBalance.subscribe(
      data => this.userbalance = data
    );
    this.route.queryParams.subscribe(
      (queryParams) => {
        this.paymentStatus.status = queryParams['status'] ?
        queryParams['status'] : '';
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
     if (this.utilityservice.checkLocalStorageStatus('user')) {
      this.user = this.utilityservice.getLocalStorage('user');
      this.currentUser = this.user.data.user_profile;
     this.session = this.user.data.session_key;
     this. getUserBalance ();
     // console.log(this.currentUser);
     }
    // this.utilityservice.userBalance.subscribe(
    //   (data) => {
    //     this.userbalance = data;
    //     console.log(data);
    //   }
    // );
    // console.log();
  // this.utilityService.
    this.auth.appUser$.subscribe(appUser => this.appUser = appUser);
    this.cart$ = await this.shoppingCartService.getCart();
  }
  showMenu() {
    this.menu = !this.menu;
    this.navbars = !this.navbars;
    this.noNavbar = !this.noNavbar;

      if (this.dropdownMenu.nativeElement.style.maxHeight) {
        this.dropdownMenu.nativeElement.style.maxHeight = null;
      } else {
        this.dropdownMenu.nativeElement.style.maxHeight = this.dropdownMenu.nativeElement.scrollHeight + 'px';
      }

      if (this.dropdown.nativeElement.style.maxHeight !== 'unset') {
        this.dropdown.nativeElement.style.maxHeight = 'unset';

       //  console.log('hello');
      } else {
        this.dropdown.nativeElement.style.maxHeight = '60px';
      }

  }
  onNavigate(arg) {
   this.isActive = [];
    if (arg === 'oderhistory') {
      this.isActive.push(arg);
      this.router.navigate(['/fanshop/my/orders']);
    } else if (arg === 'manageoders') {
       this.isActive.push(arg);
      this.router.navigate(['/fanshop/admin/products']);
    } else  if (arg === 'manageproducts') {
      this.isActive.push(arg);
      this.router.navigate(['/fanshop/admin/products']);
    } else if(arg === 'home') {
      this.router.navigate(['/home']);
    } else if(arg === 'fanshophome') {
      this.router.navigate(['/fanshop/products']);
    } else if(arg === 'wishlist') {
      this.router.navigate(['/fanshop/wishlist']);
    } else if(arg === 'finance') {
      this.router.navigate(['/5/finance']);
    } else if(arg === 'profile') {
      this.router.navigate(['/5/user/profile']);
    }
  }
  logout() {
    // console.log('logoute');
    this.utilityservice.logout.emit('logout');
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
          this.disabled = false;
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
        this.userbalance =  response.data.user_balance;
      //   this.point_balance  = parseFloat(this.user_balance.point_balance);
      //   this.currentBalance = Number(currentBalance);
      //  this.dataservice.userBalance.emit(this.user_balance);
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
}
