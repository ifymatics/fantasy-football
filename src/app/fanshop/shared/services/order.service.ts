import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
// @Injectable()
export class OrderService {
  item: Observable<Order>;
  items: Observable<Order[]>;
  private ordersCollection: AngularFirestoreCollection<Order> = null;
  private ordersDocument: AngularFirestoreDocument<Order> = null;
  constructor(private db: AngularFirestore, private shoppingCartService: ShoppingCartService) {
    this.ordersCollection = this.db.collection<Order>('orders');
    this.items = this.ordersCollection.valueChanges();
  }

  async placeOrder(order) {
    let result = await this.ordersCollection.add(order);
    // const result = this.ordersCollection.valueChanges();
    // this.shoppingCartService.clearCart();
    return result;
  }

  getOrders() {
    this.ordersCollection = this.db.collection('/orders', ref =>
      ref.orderBy('date', 'desc'));
    return this.ordersCollection.valueChanges({ idField: 'id' });
    // return this.db.list('/orders');
  }
  updateOrderStatus(order) {
    this.db.collection('/orders').doc(order.id).update(order);
  }

  getOrdersByUser(userId: string) {

    return this.db.collection('userhistory').doc(userId).collection('product')
      .valueChanges({ idField: 'id' });
    // return new Observable();
  }
}
