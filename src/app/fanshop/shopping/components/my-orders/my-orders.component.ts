import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/fanshop/shared/services/auth.service';
import { OrderService } from 'src/app/fanshop/shared/services/order.service';
import { switchMap } from 'rxjs/Operators';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  orders$;
  
  constructor(
    private authService: AuthService,
    private orderService: OrderService) { 

    this.orders$ = authService.user$.pipe(
      switchMap(u => orderService.getOrdersByUser(u.uid)));
  }
  ngOnInit() {
  }

}
