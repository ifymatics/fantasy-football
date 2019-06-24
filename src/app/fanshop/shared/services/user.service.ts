import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AppUser } from '../models/app-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// @Injectable()
export class UserService {
  items: Observable<firebase.User[]>;
  private itemsCollection: AngularFirestoreCollection<firebase.User> = null ;
  constructor(private db: AngularFirestore, private itemDoc: AngularFirestoreDocument<firebase.User>) { 
    this.itemsCollection = this.db.collection<firebase.User>('/products');
    this.items = this.itemsCollection.valueChanges();
  }

  save(user: firebase.User) {
   /* this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    });*/
    this.itemDoc.update({
     /* name: user.displayName,*/
      email: user.email
    });
  }

  get(uid: string){ 
   // return this.db.object('/users/' + uid);
    const itemDoc = this.db.doc<AppUser>('/products/' +uid);
    const item = itemDoc.valueChanges();
    return item;
  }
}
