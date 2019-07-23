import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/fanshop/shared/services/auth.service';
import { OrderService } from 'src/app/fanshop/shared/services/order.service';
import { switchMap } from 'rxjs/Operators';
import { UtilityService } from 'src/app/utility.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { Product } from 'src/app/fanshop/shared/models/product';
import { FanshopService } from 'src/app/fanshop/fanshop.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  orders$;
  session;
  userId;
  order: Product;
  more = true;
  @ViewChild('productModal') productModal: ModalDirective;
  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private utils: UtilityService,
    private fanshopservice: FanshopService) { 

    // this.orders$ = authService.user$.pipe(
    //   switchMap(u => orderService.getOrdersByUser(u.uid)));
  }
  ngOnInit() {
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    this.orders$ = this.orderService.getOrdersByUser(this.userId);
    this.getUserBalance();
  }
  show(product) {
    console.log(product);
    this.order = product;
    this.productModal.show();
   // this.product = {} as Product;
  }
  onReadMore() {
    this.more = false;
  }
  confirmPurchase (prod) {

    this.fanshopservice.buyNow(prod,this.session, this.userId);
  this.productModal.hide();
}
getUserBalance () {
  this.fanshopservice.getUserBalance(this.userId,this.session);
}

}
