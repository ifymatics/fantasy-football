import { Injectable, EventEmitter } from '@angular/core';
import { Rating } from './shared/models/rating.model';
import { Product } from './shared/models/product';
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
  product = new EventEmitter<Product>();
  constructor() { }
  receiveEmit(){
    console.log(this.product);
  }
}
