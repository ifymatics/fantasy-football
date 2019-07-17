import { Component, OnInit, ContentChild, HostBinding, Input } from '@angular/core';
import { MyDirectiveDirective } from '../my-directive.directive';
import { Rating } from '../models/rating.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { UtilityService } from 'src/app/utility.service';
import { FanshopService } from '../../fanshop.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  // @ContentChild(MyDirectiveDirective) input: MyDirectiveDirective;
  ratingObj: Rating;
  @Input('prodRating') prodRating;
  constructor(private db: AngularFirestore,
              private utils: UtilityService,
              private ratingservice: FanshopService) { }

  ngOnInit() {
   // console.log(this.prodRating);
  // this.user = this.utils.getLocalStorage('user');
  // console.log(this.user);
  this.ratingservice.ratingClick.subscribe(
    data =>  this.createRating(data)
    //console.log(data); }
  );
  }
  createRating (ratingData) {
    // CALL DATABASE API TO SUBMIT RATING
    // console.log(ratingData);
    // const ref = this.db.collection(`rating`).add({
    //  rating: ratingData
    // });
    //  ref.then(
    //   data => {
    //     console.log(data.id);
    //   }
    //  );
  }
  getRating (productId){

  }
}
