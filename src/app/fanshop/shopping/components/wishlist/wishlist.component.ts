import { Component, OnInit } from '@angular/core';
import { FanshopService } from 'src/app/fanshop/fanshop.service';
import { Product } from 'src/app/fanshop/shared/models/product';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilityService } from 'src/app/utility.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
product: Product;
session ;
userId ;
wishListProducts$;
  constructor(private fanshopservice: FanshopService,
    private db: AngularFirestore, private utils: UtilityService) { }

  ngOnInit() {
    const user  = this.utils.getLocalStorage('user');
    this.session =  user.data.session_key;
     this.userId = user.data.user_profile.user_id;
    this.fanshopservice.productAddedToWishlist.subscribe(
      data => console.log(data)
    );
    this.getWishList();
  }
getWishList(){
  this.wishListProducts$ = this.db.collection('wishlist').doc(this.userId).collection('product')
  .valueChanges({idField: 'id'});
}
}
