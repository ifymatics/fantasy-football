import { Injectable, EventEmitter } from '@angular/core';
import { Rating } from './shared/models/rating.model';
import { Product } from './shared/models/product';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { AuthloginService } from '../user/authlogin.service';
import { OrderService } from './shared/services/order.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ProductService } from './shared/services/product.service';
export interface UserBalance {
  real_bal: 0;
  winning_bal: 0;
  bonus_bal: 0;
  point_bal: 0;
}
export interface Results {
  message?: string;
  tag?: string;
}
@Injectable({
  providedIn: 'root'
})
export class FanshopService {
  user_balance = { real_amount: 0, winning_amount: 0, bonus_amount: 0, point_balance: 0, token: 0 };
  allRating = new EventEmitter<Rating[]>();
  ratingClick = new EventEmitter<Rating>();
  userBalance = new EventEmitter<any>();
  productAddedToWishlist = new EventEmitter<{}>();
  WishlistProducts = new EventEmitter<{}>();
  submittedSuccessfully = new EventEmitter<string>();
  buyFromWishList = new EventEmitter<Product>();
  getTokenSubject: Subject<any> = new Subject();
  user;
  userId;
  wishListArray = [];
  wishListProduct: Product;
  error = new EventEmitter<Results>();
  results: Results;
  constructor(private db: AngularFirestore, private service: AuthloginService,
    private orderService: OrderService, private productService: ProductService) {
    const prod = {} as Product;

    this.productAddedToWishlist.subscribe(
      data => {
        data.product.numberInSock = (data.product.qty) ? data.product.qty : 0;
        data.product.isPremium = (data.product.isPremium) ? data.product.isPremium : true;
        data.product.description = (data.product.description) ? data.product.description : 'No description Yet';
        this.wishListProduct = data.product;
        this.user = data.user;
        const userId = data.user.user_profile.user_id;
        this.userId = userId;
        this.submitToWishlist(data.flag);
        console.log(this.userId);
      }
    );
  }
  submitToWishlist(flag) {
    if (flag === 'remove') {
      this.db.collection("wishlist").doc(this.userId)
        .collection('product').doc(this.wishListProduct.id).delete()
        .then(
          data => {
            this.submittedSuccessfully.emit('removed successfully from your wishlist');
            // console.log(data);
          }
        )
        .catch(error => console.log(error));
    } else {
      this.db.collection("wishlist").doc(this.userId)
        .collection('product').doc(this.wishListProduct.id)
        .set(this.wishListProduct).
        then(
          data => {
            this.submittedSuccessfully.emit('Added successfully to your wishlist');
            // console.log(data);
          }
        ).catch(error => console.log(error));
    }
  }
  getAllProductFromWishlist(userId): Observable<any[]> {
    //const userId = '505';
    return this.db.collection('wishlist').doc(userId).collection('product')
      .valueChanges({ idField: 'id' });
    //   .subscribe(
    //     data => {console.log(data);
    //        products = data;
    //       return products;

    //     }
    //  );
  }
  getUserBalance(userId, session) {
    const param = {
      user_id: userId
    };
    this.service
      .api("user/finance/get_user_balance", param, "POST", session)
      .subscribe(
        data => {
          this.user_balance = data.data.user_balance;
          //  this.user_balance.bonus_amount = data.data.user_balance.bonus_amount;
          //  this.user_balance.winning_amount = data.data.user_balance.winning_amount;
          //  this.user_balance.real_bal = data.data.user_balance.real_amount;
          //  console.log(data.data.user_balance);
          this.userBalance.emit(this.user_balance);
        }
      );
  }
  updateProductQTY(productId, product) {
    // console.log(product)
    return this.db.collection('products').doc(productId).update(product).then(data => {

    })

  }
  createHistory(product, userId) {
    const dateCreated = Date.now();
    // console.log(product);
    product.dateCreated = dateCreated;
    const prod = product;
    // console.log(prod);
    // this.db.collection('userhistory').doc<Product>('');
    this.db.collection("userhistory").doc(userId)
      .collection('product').add(prod)
      .then(
        //  data => this.getAllUserBought()
      )
      .catch(
        error => console.log(error)
      );
    // this.itemDoc = this.db.doc<Product>('userhistory/' + this.userId);
    // const item = this.itemDoc.valueChanges();
    // console.log(item);
    // return item.subscribe(
    //   data => console.log(data)
    // );
  }
  async buyNow(product, session, user) {
    //console.log( userId);
    let results = { message: '', tag: '' }
    const param = {
      point_bal: 0,
      real_bal: 0,
      winning_bal: 0,
      bonus_bal: 0,
      token: 0,
      user_id: user.user_id
    };
    //this.user_balance.point_balance = 7927210;
    if (this.user_balance.point_balance >= product.price) {
      this.user_balance.point_balance -= product.price;
      param.point_bal = this.user_balance.point_balance;
      param.bonus_bal = this.user_balance.bonus_amount;
      param.real_bal = this.user_balance.real_amount;
      param.winning_bal = this.user_balance.winning_amount;
      param.token = this.user_balance.token;
      this.service
        .api("user/finance/updateUserBalanceFromFANSHOP", param, "POST", session)
        .subscribe(
          data => {
            //console.log(data)
            if (data.response_code === 200) {
              let order = { user: user, product: product, date: Date.now(), status: 'pending' };
              this.userBalance.emit(data.data);
              //  console.log(data);
              if (product.qty > 0) {
                product.qty -= 1;
                // this.updateProduct(product);
                // this.productService.update(product.id, product)

              }
              results.message = ' Your purchase was successful';
              results.tag = 'success';
              //return results;
              this.error.emit(results);
              this.createHistory(product, user.user_id);
              this.orderService.placeOrder(order);
              setTimeout(data => { this.updateProductQTY(product.id, product) }, 3000)
            } else {
              results.message = 'an error occured';
              results.tag = 'danger';

              this.error.emit(results);
            }
          },
          error => {
            console.log(error);
            // return result.error;


          }
        );

    } else {

      results.tag = 'danger';
      results.message = `Your balance of  ${this.user_balance.point_balance} coins
   is not enough to buy a product worth ${product.price} coins! 
   You may play a premium games to quickly earn huge amount of coins`;

      this.error.emit(results);
    }
    // this.user_balance.point_bal -= product.price;
    // console.log(+this.user_balance.point_balance);
    // return;

  }
  updateProduct(product) {
    // console.log(product);
    this.productService.update(product.id, product)
  }
}
