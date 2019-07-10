import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { AuthService } from 'angularx-social-login';
import { ShoppingCart } from 'src/app/fanshop/shared/models/shopping-cart';
import { AppUser } from 'src/app/fanshop/shared/models/app-user';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/fanshop/shared/services/auth.service';
import { ShoppingCartService } from 'src/app/fanshop/shared/services/shopping-cart.service';
import { DataService } from 'src/app/data.service';
import { UtilityService } from 'src/app/utility.service';

@Component({
// tslint:disable-next-line: component-selector
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnInit {
  blue = false;
  // selectedProduct: object;
  mobileNav = false;
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;
  menu = false;
  navbars = false;
  noNavbar = true;
  appUser: AppUser;
  userbalance = '';
  cart$: Observable<ShoppingCart>;

  constructor(private auth: AuthService,
     private shoppingCartService: ShoppingCartService,
     private dataservice: DataService,
      private utilityservice: UtilityService) {
        this.dataservice.userBalance.subscribe(
          (data) => {
            this.userbalance = data;
            console.log(data);
          }
        );
  }

  async ngOnInit() {
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

}
