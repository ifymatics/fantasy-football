import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { AuthService } from 'angularx-social-login';
import { ShoppingCart } from 'src/app/fanshop/shared/models/shopping-cart';
import { AppUser } from 'src/app/fanshop/shared/models/app-user';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/fanshop/shared/services/auth.service';
import { ShoppingCartService } from 'src/app/fanshop/shared/services/shopping-cart.service';
import { DataService } from 'src/app/data.service';
import { UtilityService } from 'src/app/utility.service';
import { FanshopService } from 'src/app/fanshop/fanshop.service';
import { Router } from '@angular/router';
import { longStackSupport } from 'q';

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
  
  userbalance = {real_amount : 0, winning_amount : 0, bonus_amount : 0, point_balance : 0};
  cart$: Observable<ShoppingCart>;

  constructor(private auth: AuthService,
     private shoppingCartService: ShoppingCartService,
     private dataservice: DataService,
      private utilityservice: UtilityService,
      private fanservice: FanshopService,
      private router: Router) {
  }

  async ngOnInit() {
    this.fanservice.userBalance.subscribe(
      data => this.userbalance = data
    );
  
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
    }
  }
  logout() {
    // console.log('logoute');
    this.utilityservice.logout.emit('logout');
  }
}
