import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCart } from '../../models/shopping-cart';
import { Product } from '../../models/product';
import { UtilityService } from 'src/app/utility.service';
import { Rating } from '../../models/rating.model';
import { FanshopService, UserBalance } from 'src/app/fanshop/fanshop.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthloginService } from 'src/app/user/authlogin.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  providers: [FanshopService]
})
export class ProductCardComponent implements OnInit {
  read = false;
  disabled = false;
  rating: Rating;
  user_balance = { real_amount: 0, winning_amount: 0, bonus_amount: 0, point_balance: 0, token: 0 };
  userId;
  color = '';
  rArray = [];
  session;
  itemDoc;
  message;
  tag;
  // coinbalance: number;
  @Input() ratingArray: Rating[];
  allRatings: Rating[];
  @Input('product') product: Product;
  @Input('showActions') showActions;
  @Input('shoppingCart') shoppingCart: ShoppingCart;
  @ViewChild('productModal', { static: true }) productModal: ModalDirective;
  @ViewChild('addedToWishlistModal', { static: true }) addedToWishlistModal: ModalDirective;
  user;
  toggle = true;
  whishlistArray = [];
  userProfile;
  constructor(private cartService: ShoppingCartService,
    private utils: UtilityService,
    private ratingservice: FanshopService,
    private db: AngularFirestore,
    private service: AuthloginService,
    public deviceService: DeviceDetectorService,
    private router: Router) { }
  ngOnInit() {

    // console.log(this.ratingArray);
    this.user = this.utils.getLocalStorage('user');
    this.session = this.user.data.session_key;
    this.userId = this.user.data.user_profile.user_id;
    this.userProfile = this.user.data.user_profile;
    // this.getAllRating()
    this.getUserBalance();
    this.ratingservice.buyFromWishList.subscribe(
      data => this.buyNow(data)
    );
    this.fanshopAlert();
    this.checkItemInWishlist();
  }
  wishlist(prod, flag) {
    // if (flag === 'remove') { 

    //    console.log(this.whishlistArray);
    //  }
    // console.log(product);
    const data = { product: prod, user: this.user.data, flag: flag };
    this.ratingservice.productAddedToWishlist.emit(data);
    this.ratingservice.submittedSuccessfully.subscribe(
      message => {
        if (message === 'removed successfully from your wishlist') {
          this.whishlistArray.splice(this.whishlistArray.indexOf(prod.id), 1);
          this.ratingservice.WishlistProducts.emit(this.whishlistArray);

        }
        this.tag = 'success';


        this.message = message;
        // alert(message);

        //  this. checkItemInWishlist();
        // this.addedToWishlistModal.show();
      }
    );
  }
  checkItemInWishlist() {
    this.db.collection('wishlist').doc(this.userId).collection('product')
      .valueChanges({ idField: 'id' }).subscribe(
        data => {
          this.ratingservice.WishlistProducts.emit(data);
          // this.whishlistArray = data;
          // console.log(this.whishlistArray);
          for (const p of data) {
            this.whishlistArray.push(p.id);
          }
        }
      );
  }
  addToCart(product: Product) {
    // console.log(product);
    this.cartService.addToCart(product);
  }
  onRead() {
    this.read = true;
  }
  closeAlert() {
    this.message = null;
  }
  buyNow(product) {
    //console.log(this.userProfile)
    this.disabled = true;
    this.ratingservice.buyNow(product, this.session, this.userProfile).then(data => {

    });

  }
  fanshopAlert() {
    this.ratingservice.error.subscribe(data => {
      //console.log(data)
      this.message = data.message;
      this.tag = data.tag;
      this.disabled = false;
      this.productModal.hide()
    })
  }
  onClickRating(index, prodId, e) {
    this.rArray = [];
    this.rating = { data: { userId: this.userId, ratingNumber: index + 1 } };
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
    if (index === 0) { this.rArray.push(index + 1); }
    else if (index === 1) { this.rArray.push(index, index + 1); }
    else if (index === 2) { this.rArray.push(index - 1, index, index + 1); }
    else if (index === 3) { this.rArray.push(index - 2, index - 1, index, index + 1); }
    else if (index === 4) { this.rArray.push(index - 3, index - 2, index - 1, index, index + 1); }
    // console.log(this.rArray);
    james = this.rArray;
    const productRate = this.db.collection("rating").doc(prodId.concat(this.rating.data.userId)).set({
      rating: this.rating
    });
    productRate.then((data) => {
      // console.log(data);
      console.log("Document successfully written!");
    })
      .catch((error) => {
        console.error("Error writing document: ", error);

      });

  }
  getUserBalance() {
    this.ratingservice.getUserBalance(this.userId, this.session);
    // const param = {
    //   user_id: this.userId
    // };
    // this.service
    // .api("user/finance/get_user_balance", param, "POST", this.session)
    // .subscribe(
    //   data => {
    //    this.user_balance = data.data.user_balance;
    //   //  this.user_balance.bonus_amount = data.data.user_balance.bonus_amount;
    //   //  this.user_balance.winning_amount = data.data.user_balance.winning_amount;
    //   //  this.user_balance.real_bal = data.data.user_balance.real_amount;
    //     //  console.log(data.data.user_balance);
    //     this.ratingservice.userBalance.emit(this.user_balance);
    //   }
    // );
  }
  createHistory(product) {
    const dateCreated = Date.now();

    product.dateCreated = dateCreated;
    const prod = product;
    // console.log(prod);
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
  getAllUserBought() {
    const products = this.db.collection('userhistory').doc(this.userId).collection('product')
      .valueChanges({ idField: 'id' });
    products.subscribe(
      data => console.log(data)
    );
  }

}
