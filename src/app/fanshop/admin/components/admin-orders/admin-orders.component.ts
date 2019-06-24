import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/fanshop/shared/services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {

  orders$;

  constructor(private orderService: OrderService) { 
   
  }

  ngOnInit() {
    this.orders$ = this.orderService.getOrders();
  }

}
