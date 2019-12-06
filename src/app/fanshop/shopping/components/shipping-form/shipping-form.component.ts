import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShoppingCart } from 'src/app/fanshop/shared/models/shopping-cart';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/fanshop/shared/services/order.service';
import { Order } from 'src/app/fanshop/shared/models/order';
import { AuthService } from 'src/app/fanshop/shared/services/auth.service';
// import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.scss']
})
export class ShippingFormComponent implements OnInit {
  @Input('cart') cart: ShoppingCart;
  shipping = {}; 
  userSubscription: Subscription;
  userId: string;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService) {
  }

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user.uid);
  }

  ngOnDestroy() { 
    this.userSubscription.unsubscribe();
  }

  async placeOrder() {
    let order = new Order(this.userId, this.shipping, this.cart);
    let result = await this.orderService.placeOrder(order);
    this.router.navigate(['/order-success', result]);
  } 

}
