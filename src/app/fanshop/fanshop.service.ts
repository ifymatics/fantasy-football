import { Injectable, EventEmitter } from '@angular/core';
import { Rating } from './shared/models/rating.model';
import { Product } from './shared/models/product';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
 export interface UserBalance {
  real_bal: 0;
   winning_bal: 0;
    bonus_bal: 0;
    point_bal: 0;
 }
@Injectable({
  providedIn: 'root'
})
export class FanshopService {
  allRating = new EventEmitter<Rating[]>();
  ratingClick = new EventEmitter<Rating>();
  userBalance = new EventEmitter<any>();
  productAddedToWishlist = new EventEmitter<{}>();
  wishListProduct: Product;
  submittedSuccessfully = new EventEmitter<string>();
  user;
  userId;
  wishListArray =[];
  constructor(private db: AngularFirestore) {
    const prod = {} as Product;

    this.productAddedToWishlist.subscribe(
      data => {
        data.product.numberInSock = (data.product.numberInSock ) ? data.product.numberInSock:5;
        data.product.isPremium = (data.product.isPremium) ? data.product.isPremium: true;
        data.product.description = ( data.product.description) ? data.product.description : 'No description Yet';
        this.wishListProduct = data.product;
        this.user = data.user;
        const userId = data.user.user_profile.user_id;
        this.userId = userId;
        this.submitToWishlist(userId);
        console.log(this.userId);
      }
    );
   }
   submitToWishlist(userId) {
     // console.log(userId);
     this.db.collection("wishlist").doc(this.userId)
     .collection('product').doc(this.wishListProduct.id).set(this.wishListProduct).
    then(
      data => {
        this.submittedSuccessfully.emit('Added successfully to your wishlist');
        console.log(data);
      }
    ).catch(error => console.log(error));
   }
   getAllProductFromWishlist(): Observable<any[]>{ 
     const userId = '505';
   return  this.db.collection('wishlist').doc(userId).collection('product')
   .valueChanges({idField: 'id'});
  //   .subscribe(
  //     data => {console.log(data);
  //        products = data;
  //       return products;

  //     }
  //  );
 }
}
