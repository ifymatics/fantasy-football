import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCart } from '../../models/shopping-cart';
import { Product } from '../../models/product';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input('product') product: Product;
  @Input('showActions') showActions = true;
  @Input('shoppingCart') shoppingCart: ShoppingCart; 

  constructor(private cartService: ShoppingCartService) { }
  ngOnInit() {
   // console.log(this.product+`hello`);
    // console.log(this.shoppingCart);
  }
  addToCart(product: Product) {
    // console.log(product);
    this.cartService.addToCart(product);
  }

}
