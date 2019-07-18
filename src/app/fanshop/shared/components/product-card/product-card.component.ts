import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCart } from '../../models/shopping-cart';
import { Product } from '../../models/product';
import { UtilityService } from 'src/app/utility.service';
import { Rating } from '../../models/rating.model';
import { FanshopService, UserBalance } from 'src/app/fanshop/fanshop.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { Alert } from 'selenium-webdriver';
import { database } from 'firebase';
import {  ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  read = false;
  rating: Rating;
  user_balance = {real_amount : 0, winning_amount : 0, bonus_amount : 0, point_balance : 0};
  userId;
  color = '';
  rArray = [];
  session;
  itemDoc;
  // coinbalance: number;
  @Input() ratingArray: Rating[];
  allRatings: Rating[];
  @Input('product') product: Product;
  @Input('showActions') showActions = true;
  @Input('shoppingCart') shoppingCart: ShoppingCart; 
  @ViewChild('productModal') productModal: ModalDirective;
  

  constructor(private cartService: ShoppingCartService,
              private utils: UtilityService,
              private ratingservice: FanshopService,
              private db: AngularFirestore,
              private service: AuthloginService) { }
  ngOnInit() {
   // console.log(this.ratingArray);
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    //  this.ratingservice.userBalance.subscribe(
    //    balance => {this.user_balance = balance;
    //     console.log(this.user_balance);}
    //  );
   // this.getAllRating()
    // console.log(user.data.user_profile.user_id);
   // console.log(this.product+`hello`);
    // console.log(this.shoppingCart);
    this.getUserBalance ();
  }
  wishlist(product){
    // console.log(product);
   this.ratingservice.product.emit(product);
  }
  addToCart(product: Product) {
    // console.log(product);
    this.cartService.addToCart(product);
  }
  onRead() {
    this.read = true;
  }
  buyNow(product) {
    // console.log(product);
    const param = {
      point_bal: 0,
      real_bal:0,
      winning_bal:0,
      bonus_bal: 0,
      user_id: this.userId
    };

    if (this.user_balance.point_balance >= product.price) {
      this.user_balance.point_balance -= product.price;
      param.point_bal = this.user_balance.point_balance;
      param.bonus_bal = this.user_balance.bonus_amount;
      param.real_bal = this.user_balance.real_amount;
      param.winning_bal = this.user_balance.winning_amount;
      this.service
  .api("user/finance/updateUserBalanceFromFANSHOP", param, "POST", this.session)
  .subscribe(
    data => {
      if (data.response_code === 200) {
        this.ratingservice.userBalance.emit(data.data);
        alert('Your purchase was successful.');
         this.productModal.hide();
         this.createHistory(product);
        // this.router.navigate([''])
        // console.log(data.data);
      }
      },
    error => console.log(error)
  );

    } else {
         alert(`YOUR BALANCE OF ${this.user_balance.point_balance} COINS
      IS NOT ENOUGH TO BUY A PRODUCT WORTH ${product.price} COINS! 
      LEARN SOME OF THE WAYS TO EARN MORE COINS IN OUR SYSTEM`);
    }
    // this.user_balance.point_bal -= product.price;
   // console.log(+this.user_balance.point_balance);

   
  }
  onClickRating (index, prodId, e) {
    this.rArray = [];
    this.rating = { data: {  userId: this.userId, ratingNumber:  index + 1 }};
   // this.ratingservice.ratingClick.emit(this.rating);
   // console.log(this.rating);
  // console.log(e);
  // const ref = this.db.collection(`rating`).add({
  //   rating: this.rating
  //  });
  //   ref.then(
  //    data => {
  //      console.log(data.id);+********************
  //    }
  //   );
  let james = [];
  if (index === 0) {  this.rArray.push(index+1);}
  else if (index === 1) {  this.rArray.push(index, index+1); }
   else if (index ===2) {this.rArray.push(index-1, index, index+1); }
   else if (index ===3) {this.rArray.push(index-2, index-1, index, index+1); }
   else if (index ===4) {this.rArray.push(index-3, index-2, index-1, index, index+1); }
   // console.log(this.rArray);
   james = this.rArray;
 const productRate = this.db.collection("rating").doc(prodId.concat(this.rating.data.userId)).set({
   rating: this.rating
}) ;
productRate.then((data)=> {
  // console.log(data);
    console.log("Document successfully written!");
})
.catch(function(error) {
    console.error("Error writing document: ", error);
  
});

  }
  getUserBalance () {
    const param = {
      user_id: this.userId
    };
    this.service
    .api("user/finance/get_user_balance", param, "POST", this.session)
    .subscribe(
      data => {
       this.user_balance = data.data.user_balance;
      //  this.user_balance.bonus_amount = data.data.user_balance.bonus_amount;
      //  this.user_balance.winning_amount = data.data.user_balance.winning_amount;
      //  this.user_balance.real_bal = data.data.user_balance.real_amount;
        //  console.log(data.data.user_balance);
        this.ratingservice.userBalance.emit(this.user_balance);
      }
    );
  }
  createHistory(product) {
    const dateCreated = Date.now();

     product.dateCreated = dateCreated;
     const prod = product;
    console.log(prod);
    // this.db.collection('userhistory').doc<Product>('');
     this.db.collection("userhistory").doc(this.userId)
     .collection('product').doc(product.id).set(prod)
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
  getAllUserBought(){
     const products =this.db.collection('userhistory').doc(this.userId).collection('product')
    .valueChanges({idField: 'id'});
    products.subscribe(
      data => console.log(data)
    );
  }

}
