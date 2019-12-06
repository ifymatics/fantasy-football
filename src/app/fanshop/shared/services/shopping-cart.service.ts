import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UtilityService } from 'src/app/utility.service';
 class Item {
   quantity: number;

 }
@Injectable({
  providedIn: 'root'
})
// @Injectable()
export class ShoppingCartService {
  item: Observable<ShoppingCart>;
  items: Observable<ShoppingCart[]>;
  private itemsCollection: AngularFirestoreCollection<ShoppingCart>;
  constructor(private db: AngularFirestore, private utilityservice: UtilityService,
     private itemDoc: AngularFirestoreDocument<ShoppingCart[]>) {
    this.itemsCollection = this.db.collection<ShoppingCart>('/products');
    this.items = this.itemsCollection.valueChanges();
   }

  async getCart(): Promise<Observable<ShoppingCart>> {
    try {
      let cartId = await this.getOrCreateCartId();
      // return this.db.object('/shopping-carts/' + cartId)
       // .map(x => new ShoppingCart(x.items));
       const itemDoc = this.db.doc<ShoppingCart>('/shopping-carts' );
      const item = itemDoc.valueChanges();
      console.log(this.item);
      return item;
    } catch (error) {
      // console.log(error);
    }
   
  }

  async addToCart(product: Product) { 
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() { 
    let cartId = await this.getOrCreateCartId();
    const itemDoc = this.db.doc<ShoppingCart>('/shopping-carts/' + cartId + '/items');
   return itemDoc.delete();
   // this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }
  

  private create() { 
  //   const id = this.db.createId();
  
  // const result = this.itemsCollection.doc(id).set({
  //     dateCreated: new Date().getTime(),
  //     id: id
  //   });
  //   return result;
  return this.db.createId();
  //   product.id = id;
  //  return this.itemsCollection.add(product);
  }

  private getItem(cartId: string, productId: string) {
    // return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
    const itemDoc = this.db.collection('/shopping-carts/' + cartId + '/items/' + productId);
    const item = itemDoc.valueChanges({idField: 'id'});
    return item;
  }

  private async getOrCreateCartId(): Promise<string> { 
    let cartId = this.utilityservice.getLocalStorage('cartId');
    if (cartId) return cartId; 

    let result = await this.create();
  this.utilityservice.setLocalStorage('cartId', result);
   return result;
  }

  private async updateItem(product: Product, change: number) {
    console.log(product);
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.id);
    item$.subscribe(item => {
      console.log(item);
      // let quantity = (item.quantity || 0) + change;
      // if (quantity === 0){ 
      //    item$.remove(); 
      // }
      // else {  item$.update({ 
      //   title: product.title,
      //   imageUrl: product.imageUrl,
      //   price: product.price,
      //   quantity: quantity
      // });}
    });
  }
}
