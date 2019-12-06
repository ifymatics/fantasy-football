import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { map } from 'rxjs/Operators';
class Categories {
  id:string;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
// @Injectable()
export class CategoryService {
  serviceData: Observable <Categories[]>;
  item: Observable<any>;
  items: Observable<any[]>;
  private itemsCollection: AngularFirestoreCollection<Product> = null ;
  constructor(private db: AngularFirestore,  
    private itemDoc: AngularFirestoreDocument<Product>) { 
      this.itemsCollection = this.db.collection<any>('/products');
    this.items = this.itemsCollection.valueChanges();
  }
  getAll()/*: AngularFirestoreCollection<any> */ { 
   /* this.itemsCollection =*/ return this.db.collection('/categories',ref => {
      return ref.orderBy('name');
    }).valueChanges({idField:'id'});

     //return this.itemsCollection.valueChanges();
  }
  mapper(object: AngularFirestoreCollection) {
   object.snapshotChanges().pipe( 
      map(changes => changes.map(c=> ({id: c.payload.doc.id, name: c.payload.doc.get('name')}))
       // this.categories.push({id: cate.payload.doc.id, name: cate.payload.doc.get('name')});
        )
    )
    return this.serviceData;
  }
}
