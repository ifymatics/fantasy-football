import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/fanshop/shared/services/auth.service';
import { OrderService } from 'src/app/fanshop/shared/services/order.service';
import { switchMap } from 'rxjs/Operators';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  orders$;
  session;
  userId;
  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private utils: UtilityService) { 

    // this.orders$ = authService.user$.pipe(
    //   switchMap(u => orderService.getOrdersByUser(u.uid)));
  }
  ngOnInit() {
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    this.orders$ = this.orderService.getOrdersByUser(this.userId);
  }

}
