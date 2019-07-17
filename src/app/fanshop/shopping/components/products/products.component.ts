import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/fanshop/shared/models/product';
import { Observable, throwError, of } from 'rxjs';
import { ShoppingCart } from 'src/app/fanshop/shared/models/shopping-cart';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/fanshop/shared/services/product.service';
import { ShoppingCartService } from 'src/app/fanshop/shared/services/shopping-cart.service';
import { switchMap, map, catchError } from 'rxjs/Operators';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Rating } from 'src/app/fanshop/shared/models/rating.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { FanshopService, UserBalance } from 'src/app/fanshop/fanshop.service';
import { UtilityService } from 'src/app/utility.service';
import { AuthloginService } from 'src/app/user/authlogin.service';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  categoryOpen = false;
  currentUser;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  cart$: Observable<ShoppingCart>;
  cart;
  session;
  mobile = false;
  coinBalance: UserBalance;
  rating: Rating[];
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService, 
    private d_svice: DeviceDetectorService,
    private db: AngularFirestore, 
    private fanservice: FanshopService,
    private utilityservice: UtilityService,
    private service: AuthloginService
  ) {
  }

  async ngOnInit() {
    this.currentUser = this.utilityservice.getLocalStorage('user');
    this.session =  this.currentUser.data.session_key;
    // console.log(this.currentUser.data.user_profile.user_id);
    // this.getUserBalance ();
    this.getAllRating ();
    this.device();
    // this.cart$ = await this.shoppingCartService.getCart();
    this.populateProducts();
    //  await this.shoppingCartService.getCart().then( 
    //  c => {
    //   c.subscribe(ca => {
    //     console.log(ca);
    //     this.cart = ca;
    //   });
    //  });
  }

  private populateProducts() {
    this.productService
      .getAll()
     .pipe(
       switchMap(products =>   {
         // console.log(products);
        this.products = products;
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
        this.category = params.get('category');
        // console.log(params.get('category'));
        this.applyFilter();
      },
      error => {
        console.log(error);
      });
  }


  private applyFilter() { 
    this.filteredProducts = (this.category) ? 
    this.products.filter(p => p.category === this.category) : 
    this.products;
    // console.log(this.filteredProducts);
  }
  device() {

    if (this.d_svice.isMobile()) {
     // console.log(this.d_svice.isMobile());
      this.mobile = true;
    } else if (this.d_svice.isDesktop) {
      this.mobile = false;
      // return this.d_svice.isDesktop();
    }
    return this.d_svice.isTablet();
  }
  getAllRating () {
    const rating = this.db.collection<Rating>('rating').valueChanges({idField: 'id'})
    .subscribe( data => {
   // console.log(data);
    // this.rating = data;
    const datum = [];
    // this.fanservice.allRating.emit(data);
    for (let i=0;i<=data.length; i++) {}
      
  });
}
getUserBalance () {
  const param = {
    user_id: this.currentUser.data.user_profile.user_id
  };
  this.service
  .api("user/finance/get_user_balance", param, "POST", this.session)
  .subscribe(
    data => {
     this.coinBalance = data.data.user_balance;
      // console.log( this.coinBalance);
      this.fanservice.userBalance.emit(this.coinBalance);
    }
  );
}
}
