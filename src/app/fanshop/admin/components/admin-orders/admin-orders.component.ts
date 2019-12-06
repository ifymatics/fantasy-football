import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/fanshop/shared/services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {

  orders$;
  namesContainer = [];
  constructor(private orderService: OrderService) {

  }

  ngOnInit() {
    this.orderService.getOrders().forEach(data => this.orders$ = data)
    //.subscribe(data => { this.orders$ = data; this.search(); });

  }
  updateStatus(order) {
    if (order.status === 'pending')
      //console.log(order)
      order.status = 'delivered';
    this.orderService.updateOrderStatus(order);

  }
  search(data?) {
    console.log(this.orders$)
    if (this.orders$.includes(data)) {
      alert('yes');
    }
  }
}
