import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
export interface Item { name: string; id: string; }
@Injectable({
  providedIn: 'root'
})
// @Injectable()
export class ProductService {

  item: Observable<Product>;
  items: Observable<Product[]>;
  private itemsCollection: AngularFirestoreCollection<Product> = null;
  constructor(private db: AngularFirestore,
    private itemDoc: AngularFirestoreDocument<Product>) {
    this.itemsCollection = this.db.collection<Product>('/products');
    this.items = this.itemsCollection.valueChanges();
  }

  create(product: Product) {
    //  const id = this.db.createId();
    //   product.id = id;
    return this.itemsCollection.add(product);
    // return this.db.doc<Item>('/products').push(product);
  }

  getAll() {
    return this.db.collection<Product>('products', ref => {
      return ref.orderBy('category', 'desc');
    }
    ).valueChanges({ idField: 'id' }); // this.db.list('/products');
  }

  get(productId) {
    // creted by Engr Ifeanyi. O
    this.itemDoc = this.db.doc<Product>('products/' + productId);
    this.item = this.itemDoc.valueChanges();
    return this.item;
    // END of creted by Engr Ifeanyi.O
    // return this.db.object('/products/' + productId);
  }

  update(productId, product) {
    // console.log(product)
    this.itemDoc.update(product).then(data => console.log('done'));
    // return this.db.object('/products/' + productId).update(product);
  }

  delete(productId) {
    this.itemDoc = this.db.doc<Product>('products/' + productId);
    return this.itemDoc.delete();
    // return this.db.object('/products/' + productId).remove();
  }
}
