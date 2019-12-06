import { Component, OnInit, ViewChild } from '@angular/core';
import { FanshopService } from 'src/app/fanshop/fanshop.service';
import { Product } from 'src/app/fanshop/shared/models/product';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilityService } from 'src/app/utility.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  @ViewChild('productModal', { static: true }) productModal: ModalDirective;
  product: Product;
  session;
  userId;
  wishListProducts$;
  wishListProducts;
  readMore = true;
  message;
  tag;
  disabled = false;
  userProfile;
  user_balance = { real_amount: 0, winning_amount: 0, bonus_amount: 0, point_balance: 0 };
  constructor(private fanshopservice: FanshopService,
    private db: AngularFirestore, private utils: UtilityService,
    public deviceService: DeviceDetectorService) { }

  ngOnInit() {
    const user = this.utils.getLocalStorage('user');
    this.session = user.data.session_key;
    this.userId = user.data.user_profile.user_id;
    this.userProfile = user.data.user_profile;
    this.getUserBalance();
    this.fanshopservice.productAddedToWishlist.subscribe(
      data => console.log(data)
    );
    this.getWishList();
  }
  getWishList() {

    this.wishListProducts$ = this.db.collection('wishlist').doc(this.userId).collection('product')
      .valueChanges({ idField: 'id' });
  }
  show(product) {
    // console.log(product);
    this.product = product;
    this.productModal.show();
    // this.product = {} as Product;
  }
  onReadMore() {
    this.readMore = !this.readMore;
  }
  confirmPurchase(prod) {
    this.disabled = true;
    this.fanshopservice.buyNow(prod, this.session, this.userProfile);
    this.fanshopservice.error.subscribe(
      data => {
        this.message = data.message;
        this.tag = data.tag;
        // console.log(data);
        setTimeout(() => this.productModal.hide(), 6000);
      }
    );
  }
  closeAlert() {
    this.message = null;
  }
  getUserBalance() {
    this.fanshopservice.getUserBalance(this.userId, this.session);
  }

}
