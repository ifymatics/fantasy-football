import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/fanshop/shared/models/product';
import { Observable, throwError, of } from 'rxjs';
import { ShoppingCart } from 'src/app/fanshop/shared/models/shopping-cart';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/fanshop/shared/services/product.service';
import { ShoppingCartService } from 'src/app/fanshop/shared/services/shopping-cart.service';
import { switchMap, map, catchError } from 'rxjs/Operators';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  cart$: Observable<ShoppingCart>;
  cart;
  mobile = false;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService, 
    private d_svice: DeviceDetectorService
  ) {
  }

  async ngOnInit() {
    this.device();
    this.cart$ = await this.shoppingCartService.getCart();
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
}
